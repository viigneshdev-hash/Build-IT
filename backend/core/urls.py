from django.urls import path
from .views import ATSCheckView, ATSScorePDFView

urlpatterns = [
    path('check-ats/', ATSCheckView.as_view(), name='check_ats'),
    path('check-ats-pdf/', ATSScorePDFView.as_view(), name='check_ats_pdf'),
]
