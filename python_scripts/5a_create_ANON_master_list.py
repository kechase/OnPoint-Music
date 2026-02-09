#!/usr/bin/env python3
"""
Create Anonymized Participant Master List (Step 2 of 2) - FIXED
===============================================================
This script reads the manually-edited participant_tracking_CONFIDENTIAL.csv
and creates the final anonymized participant master list.

PREREQUISITE: Run create_participant_tracking.py first and manually edit the tracking file.
"""

import os
import pandas as pd
from datetime import datetime

# =============================================================================
# CONFIGURATION
# =============================================================================

BASE_DATA_PATH = '/Users/katie/Documents/1-Product/Research/OnPoint-Music-Admin-and-Data/1_data_storage'
ANALYSIS_BASE_PATH = '/Users/katie/Documents/1-Product/Research/OnPoint-Music-Admin-and-Data/2_data_staged'

ADMIN_PATH = os.path.join(BASE_DATA_PATH, '1_admin')
OUTPUT_ADMIN_PATH = os.path.join(ANALYSIS_BASE_PATH, '1_admin')

# Input files
ID_MAPPING_FILE = os.path.join(ADMIN_PATH, 'id_mapping_CONFIDENTIAL.csv')
COMPLETION_DATES_FILE = os.path.join(ADMIN_PATH, 'participant_completion_dates_CONFIDENTIAL.csv')
VERSIONS_FILE = os.path.join(ADMIN_PATH, 'participants_with_versions_CONFIDENTIAL.csv')
TRACKING_FILE = os.path.join(ADMIN_PATH, 'participant_tracking_CONFIDENTIAL.csv')

# Output files
OUTPUT_CSV = os.path.join(OUTPUT_ADMIN_PATH, 'participant_ANON_complete.csv')
OUTPUT_JSON = os.path.join(OUTPUT_ADMIN_PATH, 'participant_ANON_complete.json')

# =============================================================================
# MAIN FUNCTION
# =============================================================================

def create_anonymized_master_list():
    """Create anonymized master participant list with ALL data."""
    
    print("\n" + "="*70)
    print("CREATING ANONYMIZED PARTICIPANT MASTER LIST (STEP 2 OF 2)")
    print("="*70 + "\n")
    
    # Check that required input files exist
    print("Checking input files...")
    missing_files = []
    
    if not os.path.exists(ID_MAPPING_FILE):
        missing_files.append(f"ID Mapping: {ID_MAPPING_FILE}")
    else:
        print(f"✅ Found: id_mapping_CONFIDENTIAL.csv")
    
    if not os.path.exists(COMPLETION_DATES_FILE):
        missing_files.append(f"Completion Dates: {COMPLETION_DATES_FILE}")
    else:
        print(f"✅ Found: participant_completion_dates_CONFIDENTIAL.csv")
    
    if not os.path.exists(VERSIONS_FILE):
        missing_files.append(f"Versions: {VERSIONS_FILE}")
    else:
        print(f"✅ Found: participants_with_versions_CONFIDENTIAL.csv")
    
    # Tracking file is now REQUIRED
    if not os.path.exists(TRACKING_FILE):
        print(f"\n❌ ERROR: participant_tracking_CONFIDENTIAL.csv not found!")
        print(f"   Expected location: {TRACKING_FILE}")
        print(f"\n   REQUIRED STEP: Run create_participant_tracking.py first")
        print(f"   Then manually edit the tracking file to mark exclusions")
        print(f"   Then run this script again\n")
        return False
    else:
        print(f"✅ Found: participant_tracking_CONFIDENTIAL.csv")
    
    if missing_files:
        print("\n❌ ERROR: Missing required files:")
        for file in missing_files:
            print(f"   - {file}")
        return False
    
    # Create output directory if needed
    os.makedirs(OUTPUT_ADMIN_PATH, exist_ok=True)
    print(f"\n✅ Output directory ready: {OUTPUT_ADMIN_PATH}\n")
    
    # Load all files
    print("Loading data files...")
    id_mapping = pd.read_csv(ID_MAPPING_FILE)
    print(f"   Loaded {len(id_mapping)} ID mappings")
    
    completion_dates = pd.read_csv(COMPLETION_DATES_FILE)
    print(f"   Loaded {len(completion_dates)} completion records")
    
    versions = pd.read_csv(VERSIONS_FILE)
    print(f"   Loaded {len(versions)} version records")
    
    tracking = pd.read_csv(TRACKING_FILE)
    print(f"   Loaded {len(tracking)} tracking records")
    
    # DEBUG: Show what the tracking file looks like
    print("\n--- TRACKING FILE PREVIEW ---")
    print(f"Columns: {list(tracking.columns)}")
    print(f"\nFirst 5 rows:")
    print(tracking.head())
    
    # Standardize column names
    if 'id' in completion_dates.columns and 'participant_id' not in completion_dates.columns:
        completion_dates = completion_dates.rename(columns={'id': 'participant_id'})
    
    if 'id' in versions.columns and 'participant_id' not in versions.columns:
        versions = versions.rename(columns={'id': 'participant_id'})
    
    if 'id' in tracking.columns and 'participant_id' not in tracking.columns:
        tracking = tracking.rename(columns={'id': 'participant_id'})
    
    # Ensure participant_id is string for matching
    completion_dates['participant_id'] = completion_dates['participant_id'].astype(str)
    versions['participant_id'] = versions['participant_id'].astype(str)
    tracking['participant_id'] = tracking['participant_id'].astype(str)
    id_mapping['original_id'] = id_mapping['original_id'].astype(str)
    
    print("\n--- MERGING DATA ---\n")
    
    # Step 1: Start with versions file
    print("Step 1: Using versions file as base...")
    merged = versions.copy()
    
    # Merge additional columns from completion_dates if any
    completion_unique_cols = [col for col in completion_dates.columns if col not in versions.columns or col == 'participant_id']
    if len(completion_unique_cols) > 1:
        print(f"   Merging additional columns from completion_dates")
        merged = pd.merge(
            merged,
            completion_dates[completion_unique_cols],
            on='participant_id',
            how='left'
        )
    
    print(f"   Result: {len(merged)} records")
    
    # Step 2: Merge with tracking - FIXED VERSION
    print("\nStep 2: Merging with participant tracking...")
    
    # Prepare tracking data - keep it simple and explicit
    tracking_clean = tracking[['participant_id', 'exclude_from_analysis', 'exclusion_reason']].copy()
    
    # Convert exclude_from_analysis column properly - handle both boolean and string values
    def convert_to_bool(val):
        if pd.isna(val):
            return False
        if isinstance(val, bool):
            return val
        if isinstance(val, str):
            return val.upper() in ['TRUE', 'T', '1', 'YES', 'Y']
        if isinstance(val, (int, float)):
            return bool(val)
        return False
    
    tracking_clean['exclude_from_analysis'] = tracking_clean['exclude_from_analysis'].apply(convert_to_bool)
    
    # Fill missing exclusion reasons
    tracking_clean['exclusion_reason'] = tracking_clean['exclusion_reason'].fillna('').astype(str)
    
    # DEBUG: Show what we're about to merge
    print(f"\n   Tracking data to merge:")
    print(f"   Total rows: {len(tracking_clean)}")
    print(f"   exclude_from_analysis=True: {tracking_clean['exclude_from_analysis'].sum()}")
    print(f"   exclude_from_analysis=False: {(~tracking_clean['exclude_from_analysis']).sum()}")
    
    if tracking_clean['exclude_from_analysis'].sum() > 0:
        print(f"\n   Sample of exclude_from_analysis participants:")
        exclude_from_analysis_sample = tracking_clean[tracking_clean['exclude_from_analysis'] == True].head(3)
        print(exclude_from_analysis_sample[['participant_id', 'exclude_from_analysis', 'exclusion_reason']].to_string(index=False))
    
    # Merge with main data
    merged = pd.merge(
        merged,
        tracking_clean,
        on='participant_id',
        how='left'
    )
    
    # Fill any NaN values that resulted from merge (participants not in tracking)
    merged['exclude_from_analysis'] = merged['exclude_from_analysis'].fillna(False)
    merged['exclusion_reason'] = merged['exclusion_reason'].fillna('')
    
    print(f"\n   After merge:")
    print(f"   Total records: {len(merged)}")
    print(f"   exclude_from_analysis=True: {merged['exclude_from_analysis'].sum()}")
    print(f"   exclude_from_analysis=False: {(~merged['exclude_from_analysis']).sum()}")
    
    # Show exclusion statistics
    n_exclude_from_analysis = merged['exclude_from_analysis'].sum()
    n_included = len(merged) - n_exclude_from_analysis
    
    if n_exclude_from_analysis == 0:
        print(f"\n   ⚠️  WARNING: No participants are marked as exclude_from_analysis!")
        print(f"   If you marked exclusions in the tracking file, there may be a data issue.")
        print(f"   Check the tracking file preview above.\n")
    else:
        print(f"\n   ✅ Exclusion status successfully loaded:")
        print(f"      Included: {n_included} ({100*n_included/len(merged):.1f}%)")
        print(f"      exclude_from_analysis: {n_exclude_from_analysis} ({100*n_exclude_from_analysis/len(merged):.1f}%)")
        
        print(f"\n   Exclusion reasons:")
        reason_summary = merged[merged['exclude_from_analysis'] == True].groupby('exclusion_reason').size().sort_values(ascending=False)
        for reason, count in reason_summary.items():
            reason_display = reason if reason and reason.strip() else '(no reason given)'
            print(f"      - {reason_display}: {count}")
    
    # Step 3: Add anonymous IDs
    print(f"\nStep 3: Adding anonymous IDs...")
    final = pd.merge(
        merged,
        id_mapping[['original_id', 'anonymous_id']],
        left_on='participant_id',
        right_on='original_id',
        how='left'
    )
    print(f"   Result: {len(final)} records")
    
    # Check for participants without anonymous IDs
    missing_anon = final[final['anonymous_id'].isna()]
    if len(missing_anon) > 0:
        print(f"   ⚠️  {len(missing_anon)} participants missing anonymous IDs")
    
    # Step 4: Prepare final dataset
    print("\nStep 4: Preparing final dataset...")
    
    # Select only participants with anonymous IDs
    final_anonymized = final[~final['anonymous_id'].isna()].copy()
    
    # Define output columns
    output_columns = [
        'anonymous_id',
        'completion_date',
        'total_uploads',
        'all_dates',
        'version_tag',
        'version_name',
        'version_release_date',
        'version_notes',
        'is_prerelease',
        'is_draft',
        'release_author',
        'release_url'
    ]
    
    # Add condition if available
    if 'condition' in final_anonymized.columns:
        output_columns.append('condition')
    
    # Add exclusion status
    output_columns.extend(['exclude_from_analysis', 'exclusion_reason'])
    
    # Select only columns that exist
    available_columns = [col for col in output_columns if col in final_anonymized.columns]
    output_df = final_anonymized[available_columns].copy()
    
    # Sort by anonymous ID
    output_df = output_df.sort_values('anonymous_id')
    
    print(f"   Final dataset: {len(output_df)} participants")
    
    # Show distributions
    if 'version_tag' in output_df.columns:
        print("\n--- VERSION DISTRIBUTION ---")
        version_counts = output_df['version_tag'].value_counts().sort_index()
        for version, count in version_counts.items():
            exclude_from_analysis_in_version = output_df[(output_df['version_tag'] == version) & (output_df['exclude_from_analysis'] == True)].shape[0]
            included_in_version = count - exclude_from_analysis_in_version
            print(f"   {version}: {count} total ({included_in_version} included, {exclude_from_analysis_in_version} exclude_from_analysis)")
    
    # Save CSV
    print(f"\n--- SAVING OUTPUT ---\n")
    csv_output = output_df.copy()
    if 'version_notes' in csv_output.columns:
        csv_output['version_notes'] = csv_output['version_notes'].apply(
            lambda x: x[:300] + '... [see JSON for full notes]' if pd.notna(x) and len(str(x)) > 300 else x
        )
    
    csv_output.to_csv(OUTPUT_CSV, index=False)
    print(f"✅ Saved anonymized CSV to:")
    print(f"   {OUTPUT_CSV}")
    
    # Save JSON
    output_df.to_json(OUTPUT_JSON, orient='records', indent=2)
    print(f"✅ Saved anonymized JSON to:")
    print(f"   {OUTPUT_JSON}")
    
    # Show sample of exclude_from_analysis participants in final output (if any)
    if output_df['exclude_from_analysis'].sum() > 0:
        print(f"\n--- SAMPLE OF exclude_from_analysis PARTICIPANTS IN FINAL OUTPUT ---")
        exclude_from_analysis_sample = output_df[output_df['exclude_from_analysis'] == True][['anonymous_id', 'version_tag', 'exclude_from_analysis', 'exclusion_reason']].head(3)
        print(exclude_from_analysis_sample.to_string(index=False))
    
    print("\n" + "="*70)
    print("✅ ANONYMIZED MASTER LIST CREATED SUCCESSFULLY")
    print("="*70)
    print(f"\n📊 Final statistics:")
    print(f"   Total participants: {len(output_df)}")
    print(f"   Included: {(~output_df['exclude_from_analysis']).sum()}")
    print(f"   exclude_from_analysis: {output_df['exclude_from_analysis'].sum()}")
    print(f"\n💡 Use in R analysis:")
    print(f"   participants <- read_csv('participant_ANON_complete.csv')")
    print(f"   analysis_sample <- participants %>% filter(exclude_from_analysis == FALSE)")
    print()
    
    return True

# =============================================================================
# EXECUTION
# =============================================================================

if __name__ == "__main__":
    success = create_anonymized_master_list()
    
    if not success:
        print("\n❌ Script failed - please check error messages above")
        exit(1)
    else:
        print("✅ Script completed successfully!")
        exit(0)