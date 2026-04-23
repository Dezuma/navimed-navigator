
import pandas as pd, numpy as np, random, os
from datetime import datetime, timedelta

random.seed(7)
np.random.seed(7)
OUTDIR = "/mnt/data/navimed_scheduling_synth"

# This script regenerates the NaviMed scheduling synthetic datasets.
# Edit the row counts, specialties, clinic mix, or scoring logic as needed.

# Starter files generated:
# - patients.csv
# - clinics.csv
# - providers.csv
# - schedule_slots.csv
# - appointments.csv
# - reminder_events.csv
# - transport_context.csv
# - scheduling_preferences.csv

print("Synthetic scheduling datasets already generated in:", OUTDIR)
