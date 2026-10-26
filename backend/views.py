"""
KeyDirect Real Estate - Enterprise API Views
Engineered by SimeonJrStudios under executive direction of Afolabi Oluwadamilare Simeon.
"""

import logging
from django.db.models import Q
from django.contrib.gis.geos import Point
from django.contrib.gis.measure import D
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import CustomUser, Property, UserActivityLog, ChatMessage, CurrencyRate
from .serializers import (
    PropertyListSerializer,
    PropertyDetailSerializer,
    UserActivityLogSerializer,
    ChatMessageSerializer,
)

logger = logging.getLogger(__name__)


class PropertyViewSet(viewsets.ModelViewSet):
    """
    CRUD and Spatial Search for KeyDirect Real Estate Listings.
    Filters by category (Apartments, Party Apartments, Event Centers, Plots/Land, Commercial, Hotels, Rental).
    """

    queryset = Property.objects.select_related("owner").order_by("-created_at")

    def get_serializer_class(self):
        if self.action in ["list", "spatial_search"]:
            return PropertyListSerializer
        return PropertyDetailSerializer

    def get_permissions(self):
        if self.action in ["list", "retrieve", "spatial_search", "record_virtual_view"]:
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_queryset(self):
        qs = super().get_queryset()
        category = self.request.query_params.get("category")
        listing_type = self.request.query_params.get("listing_type")
        state = self.request.query_params.get("state")
        search = self.request.query_params.get("search")

        if category and category != "All":
            qs = qs.filter(category=category)
        if listing_type:
            qs = qs.filter(listing_type=listing_type)
        if state:
            qs = qs.filter(state__iexact=state)
        if search:
            qs = qs.filter(
                Q(title__icontains=search)
                | Q(neighbourhood__icontains=search)
                | Q(description__icontains=search)
            )
        return qs

    @action(detail=False, methods=["get"], url_path="spatial-search")
    def spatial_search(self, request):
        """
        Executes PostGIS dynamic radius search around GPS coordinates.
        Query params: `lat`, `lng`, `radius_km` (defaults to 15km).
        """
        lat = request.query_params.get("lat")
        lng = request.query_params.get("lng")
        radius_km = float(request.query_params.get("radius_km", 15))

        if not lat or not lng:
            return Response(
                {"detail": "Both 'lat' and 'lng' query parameters are required for spatial search."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            point = Point(float(lng), float(lat), srid=4326)
            properties = Property.objects.filter(
                coordinates__distance_lte=(point, D(km=radius_km))
            ).select_related("owner")[:50]

            serializer = PropertyListSerializer(properties, many=True)
            return Response(serializer.data)
        except Exception as exc:
            logger.error("Spatial search error: %s", exc)
            return Response({"detail": "Invalid coordinates provided."}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=["post"], url_path="record-virtual-view")
    def record_virtual_view(self, request, pk=None):
        """Records a 360 Virtual Look view in the audit log."""
        property_obj = self.get_object()
        property_obj.views_count += 1
        property_obj.save(update_fields=["views_count"])

        user = request.user if request.user.is_authenticated else None
        UserActivityLog.objects.create(
            user=user,
            property=property_obj,
            action=UserActivityLog.ActionType.VIRTUAL_TOUR_VIEWED,
            description=f"360 Virtual Inspection viewed for {property_obj.title}",
            metadata={"session_id": request.session.session_key if hasattr(request, "session") else None},
        )
        return Response({"status": "recorded", "views_count": property_obj.views_count})


class UserActivityLogViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Audit log endpoint powering the Seller Audit Dashboard and Renter Request Tracker.
    """

    serializer_class = UserActivityLogSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        role = self.request.query_params.get("view_role", user.role)

        if role in [CustomUser.Role.OWNER, CustomUser.Role.AGENT, CustomUser.Role.DEVELOPER]:
            # Seller dashboard: all activities on properties owned by this user
            return UserActivityLog.objects.filter(
                property__owner=user
            ).select_related("user", "property").order_by("-created_at")

        # Renter tracker: activities initiated by this user
        return UserActivityLog.objects.filter(
            user=user
        ).select_related("property").order_by("-created_at")
