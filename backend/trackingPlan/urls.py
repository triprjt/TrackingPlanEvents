from django.urls import path
from .views import get_events, create_event, get_event_by_name, get_sources, save_event, update_event, get_tracking_plans, create_or_update_tracking_plan, get_tracking_plan_by_name, remove_event_from_tracking_plan, get_sources, save_source_with_name

urlpatterns = [
    path('events/', get_events),
    path('events/save/', save_event),
    path('events/<str:name>/', get_event_by_name),
    path('trackingplans/', get_tracking_plans, name='get_tracking_plans'),
    path('trackingplans/<str:name>/', get_tracking_plan_by_name),
    path('trackingplan/save', create_or_update_tracking_plan,
         name='create_or_update_tracking_plan'),
    path('trackingplan/<str:tracking_plan_name>/remove/<str:event_name>/',
         remove_event_from_tracking_plan, name='remove_event_from_tracking_plan'),
    path('sources/', get_sources, name='get-sources'),
    path('sources/<str:source_name>/', get_sources, name='get-source-by-name'),
    path('source/create/', save_source_with_name, name='create-source'),
]
