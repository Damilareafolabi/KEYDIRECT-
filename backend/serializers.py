"""
Enterprise DRF Serializers for KeyDirect Real Estate.
Enforces validation rules, PostGIS GeoJSON serialization, and audit logging.
"""

from rest_framework import serializers
from .models import CustomUser, Property, UserActivityLog, ChatMessage, CurrencyRate


class UserBriefSerializer(serializers.ModelSerializer):
    """Safe public representation of user profile without PII."""

    role_display = serializers.CharField(source="get_role_display", read_only=True)
    kyc_display = serializers.CharField(source="get_kyc_tier_display", read_only=True)

    class Meta:
        model = CustomUser
        fields = [
            "id",
            "full_name",
            "role",
            "role_display",
            "kyc_tier",
            "kyc_display",
            "is_verified",
            "avatar_url",
            "whatsapp_enabled",
        ]
        read_only_fields = fields


class PropertyListSerializer(serializers.ModelSerializer):
    """High-performance serializer for map & catalog listings."""

    owner = UserBriefSerializer(read_only=True)
    category_display = serializers.CharField(source="get_category_display", read_only=True)
    listing_type_display = serializers.CharField(source="get_listing_type_display", read_only=True)

    class Meta:
        model = Property
        fields = [
            "id",
            "slug",
            "title",
            "category",
            "category_display",
            "listing_type",
            "listing_type_display",
            "base_currency",
            "base_price",
            "price_period",
            "inspection_fee_saved_ngn",
            "bedrooms",
            "bathrooms",
            "state",
            "lga",
            "neighbourhood",
            "address",
            "latitude",
            "longitude",
            "images",
            "has_virtual_tour",
            "is_verified_listing",
            "views_count",
            "inquiries_count",
            "owner",
            "created_at",
        ]


class PropertyDetailSerializer(serializers.ModelSerializer):
    """Comprehensive serializer including 360 virtual room viewpoints & audit data."""

    owner = UserBriefSerializer(read_only=True)

    class Meta:
        model = Property
        fields = "__all__"
        read_only_fields = [
            "id",
            "slug",
            "is_verified_listing",
            "verified_at",
            "views_count",
            "inquiries_count",
            "created_at",
            "updated_at",
        ]

    def create(self, validated_data):
        # Auto-assign requesting owner
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            validated_data["owner"] = request.user
        return super().create(validated_data)


class UserActivityLogSerializer(serializers.ModelSerializer):
    """Audit log serializer for Owner Seller Dashboard and Renter Request Tracker."""

    action_display = serializers.CharField(source="get_action_display", read_only=True)
    user_name = serializers.CharField(source="user.full_name", default="Anonymous")
    property_title = serializers.CharField(source="property.title", default=None)

    class Meta:
        model = UserActivityLog
        fields = [
            "id",
            "user",
            "user_name",
            "property",
            "property_title",
            "action",
            "action_display",
            "description",
            "metadata",
            "created_at",
        ]
        read_only_fields = fields


class ChatMessageSerializer(serializers.ModelSerializer):
    """Secure direct messaging serializer."""

    sender_name = serializers.CharField(source="sender.full_name", read_only=True)
    recipient_name = serializers.CharField(source="recipient.full_name", read_only=True)

    class Meta:
        model = ChatMessage
        fields = [
            "id",
            "property",
            "sender",
            "sender_name",
            "recipient",
            "recipient_name",
            "text",
            "is_read",
            "created_at",
        ]
        read_only_fields = ["id", "sender", "is_read", "created_at"]
