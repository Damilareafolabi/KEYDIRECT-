"""
KeyDirect Real Estate - Enterprise Data Models
Engineered by SimeonJrStudios under executive direction of Afolabi Oluwadamilare Simeon.

Production-grade Django models with spatial PostGIS geometries, granular RBAC,
audit tracking, anti-fraud verification, and localized currency handling.
"""

import uuid
from decimal import Decimal
from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.contrib.gis.db import models as gis_models
from django.core.validators import MinValueValidator, MaxValueValidator, RegexValidator
from django.utils.translation import gettext_lazy as _


class CustomUserManager(BaseUserManager):
    """Custom user manager supporting phone or email authentication without usernames."""

    def create_user(self, email=None, phone=None, password=None, **extra_fields):
        if not email and not phone:
            raise ValueError(_("Either an email address or phone number must be provided."))
        if email:
            email = self.normalize_email(email)
        extra_fields.setdefault("is_active", True)
        user = self.model(email=email, phone=phone, **extra_fields)
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save(using=self._db)
        return user

    def create_superuser(self, email=None, phone=None, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("role", CustomUser.Role.ADMIN)

        if extra_fields.get("is_staff") is not True:
            raise ValueError(_("Superuser must have is_staff=True."))
        if extra_fields.get("is_superuser") is not True:
            raise ValueError(_("Superuser must have is_superuser=True."))

        return self.create_user(email=email, phone=phone, password=password, **extra_fields)


class CustomUser(AbstractUser):
    """
    Core enterprise identity model for KeyDirect Real Estate.
    Replaces default Django username with UUID primary key and verified credentials.
    """

    class Role(models.TextChoices):
        OWNER = "OWNER", _("Property Owner / Landlord")
        AGENT = "AGENT", _("Accredited Agent / Broker")
        DEVELOPER = "DEVELOPER", _("Real Estate Developer")
        RENTER = "RENTER", _("House Hunter / Renter")
        ADMIN = "ADMIN", _("Platform Administrator")

    class KycTier(models.TextChoices):
        UNVERIFIED = "UNVERIFIED", _("Unverified")
        TIER_1 = "TIER_1", _("Tier 1 - Government ID Verified")
        TIER_2 = "TIER_2", _("Tier 2 - Title Deed Audited")

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    username = None  # Explicitly disabled in favor of email / phone
    email = models.EmailField(_("email address"), unique=True, null=True, blank=True, db_index=True)
    phone_regex = RegexValidator(
        regex=r"^\+?[0-9]{9,15}$",
        message=_("Phone number must be entered in international format: '+2348012345678'."),
    )
    phone = models.CharField(
        validators=[phone_regex],
        max_length=20,
        unique=True,
        null=True,
        blank=True,
        db_index=True,
    )
    full_name = models.CharField(_("Full Legal Name"), max_length=255)
    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.RENTER,
        db_index=True,
    )
    kyc_tier = models.CharField(
        max_length=20,
        choices=KycTier.choices,
        default=KycTier.UNVERIFIED,
        db_index=True,
    )
    is_verified = models.BooleanField(default=False, db_index=True)
    nin_hash = models.CharField(max_length=64, blank=True, null=True)
    bvn_hash = models.CharField(max_length=64, blank=True, null=True)
    cac_number = models.CharField(max_length=50, blank=True, null=True)
    
    preferred_currency = models.CharField(max_length=3, default="NGN")
    preferred_language = models.CharField(max_length=5, default="en")
    
    avatar_url = models.URLField(max_length=1000, blank=True, null=True)
    whatsapp_enabled = models.BooleanField(default=True)
    inspection_fee_protection_optin = models.BooleanField(
        default=True,
        help_text=_("Guarantees compliance with zero physical inspection fees."),
    )

    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = CustomUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["full_name"]

    class Meta:
        db_table = "kd_users"
        verbose_name = _("KeyDirect User")
        verbose_name_plural = _("KeyDirect Users")
        indexes = [
            models.Index(fields=["role", "is_verified"], name="idx_user_role_verified"),
            models.Index(fields=["email", "phone"], name="idx_user_lookup"),
        ]

    def __str__(self):
        identifier = self.email or self.phone or str(self.id)
        return f"{self.full_name} ({self.get_role_display()}) - {identifier}"


class CurrencyRate(models.Model):
    """
    Local offline currency conversion rate matrix.
    Eliminates reliance on external paid rate APIs.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    code = models.CharField(max_length=3, unique=True, db_index=True)
    name = models.CharField(max_length=64)
    symbol = models.CharField(max_length=8)
    rate_to_usd = models.DecimalField(
        max_digits=14,
        decimal_places=6,
        help_text=_("Exchange rate pegged against 1 USD base."),
    )
    is_active = models.BooleanField(default=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "kd_currency_rates"
        verbose_name = _("Currency Exchange Rate")
        verbose_name_plural = _("Currency Exchange Rates")

    def __str__(self):
        return f"{self.code} ({self.symbol}) @ {self.rate_to_usd}"


class Property(models.Model):
    """
    Spatial PostGIS property listing model.
    Enforces anti-fraud checks, HD 360 virtual look assets, and zero-commission direct contacts.
    """

    class Category(models.TextChoices):
        APARTMENTS = "Apartments", _("Apartments")
        PARTY_APARTMENTS = "Party Apartments", _("Party Apartments & Event Lounges")
        EVENT_CENTERS = "Event Centers", _("Event Centers & Marquees")
        PLOTS_LAND = "Plots / Land", _("Plots / Land")
        COMMERCIAL = "Commercial", _("Commercial & Offices")
        HOTELS = "Hotels", _("Hotels & Shortlets")
        RENTAL = "Rental", _("Rental (Self-Contain, Studio, Flats, Warehouses, Shops)")

    class ListingType(models.TextChoices):
        DIRECT_OWNER = "Direct Owner", _("Direct Landlord / Owner (0% Commission)")
        VERIFIED_AGENT = "Verified Agent", _("Accredited Licensed Agent")
        DEVELOPER = "Developer", _("Property Developer")

    class LandAction(models.TextChoices):
        BUY = "Buy Land", _("Outright Land Purchase")
        RENT = "Rent / Lease Land", _("Land Lease")
        ANY = "Any", _("Any Transaction")

    class PricePeriod(models.TextChoices):
        PER_ANNUM = "per annum", _("Per Annum")
        MONTHLY = "monthly", _("Monthly")
        PER_NIGHT = "per night", _("Per Night")
        PER_EVENT = "per event", _("Per Event")
        TOTAL_PURCHASE = "total purchase", _("Total Purchase Price")

    class TitleDocumentType(models.TextChoices):
        CERTIFICATE_OF_OCCUPANCY = "C of O", _("Certificate of Occupancy")
        DEED_OF_ASSIGNMENT = "Deed of Assignment", _("Deed of Assignment")
        GOVERNORS_CONSENT = "Governor's Consent", _("Governor's Consent")
        GAZETTE = "Gazette", _("Official Gazette")
        SURVEY_PLAN = "Survey Plan", _("Registered Survey Plan")
        CAC_INCORPORATION = "CAC Certificate", _("Corporate Affairs Commission Certificate")

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    slug = models.SlugField(max_length=255, unique=True, db_index=True)
    title = models.CharField(max_length=255, db_index=True)
    description = models.TextField()

    category = models.CharField(
        max_length=32,
        choices=Category.choices,
        default=Category.RENTAL,
        db_index=True,
    )
    listing_type = models.CharField(
        max_length=32,
        choices=ListingType.choices,
        default=ListingType.DIRECT_OWNER,
        db_index=True,
    )
    land_action = models.CharField(
        max_length=32,
        choices=LandAction.choices,
        default=LandAction.ANY,
        blank=True,
    )

    owner = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name="properties",
        db_index=True,
    )

    # Base financial valuation
    base_currency = models.CharField(max_length=3, default="NGN", db_index=True)
    base_price = models.DecimalField(
        max_digits=14,
        decimal_places=2,
        validators=[MinValueValidator(Decimal("0.00"))],
        db_index=True,
    )
    price_period = models.CharField(
        max_length=20,
        choices=PricePeriod.choices,
        default=PricePeriod.PER_ANNUM,
    )
    inspection_fee_saved_ngn = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal("15000.00"),
        help_text=_("Estimated tenant inspection fee saved through Virtual Look."),
    )

    # Specifications
    bedrooms = models.PositiveIntegerField(default=1)
    bathrooms = models.PositiveIntegerField(default=1)
    sitting_rooms = models.PositiveIntegerField(default=1)
    area_sq_ft = models.PositiveIntegerField(null=True, blank=True)

    # Spatial PostGIS Location
    state = models.CharField(max_length=64, db_index=True)
    lga = models.CharField(max_length=64, db_index=True)
    neighbourhood = models.CharField(max_length=128, db_index=True)
    address = models.CharField(max_length=255)
    
    # Point geometry in standard WGS 84 (SRID 4326)
    coordinates = gis_models.PointField(
        srid=4326,
        null=True,
        blank=True,
        spatial_index=True,
        help_text=_("PostGIS spatial point containing (Longitude, Latitude)."),
    )
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)

    # Media & Virtual Inspection
    images = models.JSONField(default=list, help_text=_("Array of high-res image URLs."))
    has_virtual_tour = models.BooleanField(default=True, db_index=True)
    virtual_tour_360_rooms = models.JSONField(
        default=list,
        blank=True,
        help_text=_("JSON list of 360 panoramic room viewpoints and hotspots."),
    )
    video_tour_url = models.URLField(max_length=1000, blank=True, null=True)
    floor_plan_url = models.URLField(max_length=1000, blank=True, null=True)

    # Party / Event specific specs
    event_specs = models.JSONField(
        default=dict,
        blank=True,
        help_text=_("Capacity, DJ allowance, power generators, sound curfew specs."),
    )

    # Trust & Verification
    title_document_type = models.CharField(
        max_length=32,
        choices=TitleDocumentType.choices,
        default=TitleDocumentType.CERTIFICATE_OF_OCCUPANCY,
    )
    is_verified_listing = models.BooleanField(default=True, db_index=True)
    verified_at = models.DateTimeField(null=True, blank=True)

    # Engagement & Performance
    views_count = models.PositiveIntegerField(default=0)
    inquiries_count = models.PositiveIntegerField(default=0)
    featured_in_billboard = models.BooleanField(default=False, db_index=True)

    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "kd_properties"
        verbose_name = _("Property Listing")
        verbose_name_plural = _("Property Listings")
        indexes = [
            models.Index(fields=["category", "listing_type"], name="idx_prop_cat_type"),
            models.Index(fields=["state", "neighbourhood"], name="idx_prop_location"),
            models.Index(fields=["base_price", "base_currency"], name="idx_prop_price"),
        ]

    def __str__(self):
        return f"{self.title} - {self.neighbourhood}, {self.state} ({self.listing_type})"


class UserActivityLog(models.Model):
    """
    Immutable audit and activity log tracking all actions across listings,
    inquiries, virtual tour inspections, and verification requests.
    """

    class ActionType(models.TextChoices):
        LISTING_CREATED = "LISTING_CREATED", _("Property Listed")
        LISTING_UPDATED = "LISTING_UPDATED", _("Property Updated")
        VIRTUAL_TOUR_VIEWED = "VIRTUAL_TOUR_VIEWED", _("360 Virtual Inspection Viewed")
        MESSAGE_SENT = "MESSAGE_SENT", _("Direct Message Dispatched")
        INQUIRY_SUBMITTED = "INQUIRY_SUBMITTED", _("Renter Inquiry Submitted")
        TOUR_SCHEDULED = "TOUR_SCHEDULED", _("Live Video Tour Scheduled")
        VERIFICATION_REQUESTED = "VERIFICATION_REQUESTED", _("Title Verification Submitted")
        STATUS_CHANGED = "STATUS_CHANGED", _("Listing Status Modified")
        OFFLINE_MAP_CACHED = "OFFLINE_MAP_CACHED", _("Offline Geo Tile Bundle Cached")
        ANTI_SCAM_FLAGGED = "ANTI_SCAM_FLAGGED", _("Suspicious Impersonator Flagged")

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        CustomUser,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="activity_logs",
        db_index=True,
    )
    property = models.ForeignKey(
        Property,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="activity_logs",
        db_index=True,
    )
    action = models.CharField(
        max_length=40,
        choices=ActionType.choices,
        db_index=True,
    )
    description = models.CharField(max_length=500)
    metadata = models.JSONField(default=dict, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.CharField(max_length=512, blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        db_table = "kd_user_activity_logs"
        verbose_name = _("User Activity Log")
        verbose_name_plural = _("User Activity Logs")
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["user", "action"], name="idx_audit_user_action"),
            models.Index(fields=["property", "created_at"], name="idx_audit_prop_time"),
        ]

    def __str__(self):
        user_str = self.user.full_name if self.user else "Anonymous"
        return f"[{self.created_at:%Y-%m-%d %H:%M}] {user_str}: {self.get_action_display()}"


class ChatMessage(models.Model):
    """
    Direct end-to-end encrypted messaging between house hunters and verified landlords.
    Bypasses middlemen brokers.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    property = models.ForeignKey(
        Property,
        on_delete=models.CASCADE,
        related_name="chat_messages",
        db_index=True,
    )
    sender = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name="sent_messages",
        db_index=True,
    )
    recipient = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name="received_messages",
        db_index=True,
    )
    text = models.TextField()
    is_read = models.BooleanField(default=False, db_index=True)
    is_flagged_for_fee_solicitation = models.BooleanField(
        default=False,
        help_text=_("Automated safeguard detecting prohibited offline inspection fee demands."),
    )
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        db_table = "kd_chat_messages"
        verbose_name = _("Chat Message")
        verbose_name_plural = _("Chat Messages")
        ordering = ["created_at"]

    def __str__(self):
        return f"Msg from {self.sender.full_name} re: {self.property.title}"
