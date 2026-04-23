# NaviMed Scheduling Synthetic Data

Files:
- patients.csv: patient-level drivers for scheduling behavior
- clinics.csv: clinic access and modality support
- providers.csv: provider specialty and operating characteristics
- schedule_slots.csv: supply-side slot inventory
- appointments.csv: booked and in-flight appointments
- reminder_events.csv: patient reminder responses that trigger reschedule/cancel flows
- transport_context.csv: day-of arrival risk signals
- scheduling_preferences.csv: ranking preferences for appointment selection

Suggested ranking features for the scheduling agent:
1. specialty match
2. modality match
3. same-provider preference
4. time-of-day preference
5. travel fit
6. soonest available
7. lateness risk
8. clinic access score
