import os
import json
import csv
import firebase_admin
from firebase_admin import credentials, storage
from typing import List, Optional
import pandas as pd
from datetime import datetime

# =============================================================================
# CONFIGURATION 
# =============================================================================
# DOWNLOAD OPTIONS - Choose one:
DOWNLOAD_MODE = 'ALL'  # Options: 'ALL', 'SINGLE', 'BATCH'

# For SINGLE mode:
SUBJECT_ID = 'participant_ID'

# For BATCH mode - Add the participant IDs you want to download:
# BATCH_PARTICIPANT_IDS = [
        # Add as many participant IDs as you want here ]

FIREBASE_DATE = '2025-11-05'  # Date folder in Firebase Storage (format: YYYY-MM-DD)
BASE_DATA_PATH = ''
VERSION = ''  # Updated for production version
SERVICE_ACCOUNT_PATH = ""
STORAGE_BUCKET = ""
# =============================================================================

# Initialize Firebase
if not firebase_admin._apps:
    cred = credentials.Certificate(SERVICE_ACCOUNT_PATH)
    firebase_admin.initialize_app(cred, {
        'storageBucket': STORAGE_BUCKET
    })

bucket = storage.bucket()

def ensure_directory_exists(file_path):
    """Create directory if it doesn't exist"""
    directory = os.path.dirname(file_path)
    if not os.path.exists(directory):
        os.makedirs(directory)

def list_all_datasets(verbose=True):
    """List all complete datasets in Firebase Storage."""
    try:
        if verbose:
            print("📂 Scanning for complete datasets in Firebase Storage...")
        
        blobs = list(bucket.list_blobs(prefix=f'production_datasets/{FIREBASE_DATE}'))
        
        if not blobs:
            if verbose:
                print("❌ No complete datasets found")
            return []
        
        datasets = []
        if verbose:
            print(f"✅ Found {len(blobs)} complete datasets:")
            print("=" * 100)
        
        for blob in blobs:
            filename = blob.name.split('/')[-1]
            participant_id = filename.split('_')[0] if '_' in filename else 'unknown'
            
            size_mb = (blob.size / (1024 * 1024)) if blob.size else 0
            created = blob.time_created.strftime("%Y-%m-%d %H:%M:%S") if blob.time_created else 'unknown'
            
            # Try to get metadata from custom metadata
            metadata = blob.metadata or {}
            condition = metadata.get('experiment_condition', 'unknown')
            trial_count = metadata.get('trial_count', '?')
            
            dataset_info = {
                'participant_id': participant_id,
                'filename': filename,
                'storage_path': blob.name,
                'size_mb': size_mb,
                'created': created,
                'condition': condition,
                'trial_count': trial_count,
                'blob': blob
            }
            datasets.append(dataset_info)
            
            if verbose:
                print(f"   👤 {participant_id:<12} | 🎯 {condition:<2} | 🧪 {trial_count:<3} | 📊 {size_mb:>6.1f} MB | ⏰ {created}")
        
        if verbose:
            print("=" * 100)
        return datasets
        
    except Exception as e:
        print(f"❌ Error listing datasets: {str(e)}")
        return []

def download_complete_dataset(subject_id: str) -> Optional[dict]:
    """Download complete dataset for a subject."""
    try:
        print(f"🔍 Looking for dataset for subject: {subject_id}")
        
        # Find the dataset file
        datasets = list_all_datasets(verbose=False)
        subject_datasets = [d for d in datasets if d['participant_id'] == subject_id]
        
        if not subject_datasets:
            print(f"❌ No dataset found for subject {subject_id}")
            return None
        
        if len(subject_datasets) > 1:
            print(f"⚠️  Multiple datasets found for {subject_id}, using most recent")
            # Sort by creation time, use most recent
            subject_datasets.sort(key=lambda x: x['created'], reverse=True)
        
        dataset_info = subject_datasets[0]
        print(f"📥 Downloading: {dataset_info['filename']} ({dataset_info['size_mb']:.1f} MB)")
        
        # Download the file
        blob = dataset_info['blob']
        json_data = blob.download_as_text()
        complete_dataset = json.loads(json_data)
        
        print(f"✅ Dataset downloaded successfully!")
        print(f"   👤 Participant: {complete_dataset['participant']['id']}")
        print(f"   🎯 Condition: {complete_dataset['participant'].get('condition', 'unknown')}")
        print(f"   🧪 Trials: {len(complete_dataset.get('trials', []))}")
        print(f"   📍 Movement samples: {complete_dataset.get('metadata', {}).get('total_movement_samples', 0)}")
        print(f"   📈 Enhanced samples: {complete_dataset.get('metadata', {}).get('total_enhanced_samples', 0)}")
        
        return complete_dataset
        
    except Exception as e:
        print(f"❌ Error downloading dataset for {subject_id}: {str(e)}")
        import traceback
        traceback.print_exc()
        return None

def save_dataset_to_files(dataset: dict, output_dir: str) -> bool:
    """Save complete dataset to multiple CSV files and JSON."""
    try:
        participant_id = dataset['participant']['id']
        condition = dataset['participant'].get('condition', 'unknown')
        print(f"💾 Saving dataset for {participant_id} (Condition {condition}) to multiple formats...")
        
        # Create output directory
        subject_dir = os.path.join(output_dir, f"{participant_id}_condition_{condition}")
        os.makedirs(subject_dir, exist_ok=True)
        
        # 1. Save complete JSON for full analysis
        json_path = os.path.join(subject_dir, f"{participant_id}_complete_dataset.json")
        with open(json_path, 'w') as f:
            json.dump(dataset, f, indent=2)
        print(f"✅ Complete JSON: {json_path}")
        
        # 2. Save participant info (updated field names)
        participant_path = os.path.join(subject_dir, f"{participant_id}_participant_demographics.csv")
        participant_data = dataset['participant']
        
        with open(participant_path, 'w', newline='') as f:
            writer = csv.writer(f)
            writer.writerow(['field', 'value'])
            for key, value in participant_data.items():
                if isinstance(value, (list, dict)):
                    value = json.dumps(value)
                writer.writerow([key, value])
        print(f"✅ Participant info: {participant_path}")
        
        # 3. Save basic trial data (updated structure)
        trials_path = os.path.join(subject_dir, f"{participant_id}_trial_summary.csv")
        
        trial_rows = []
        for trial in dataset.get('trials', []):
            # Get movement data counts
            basic_positions = trial.get('movement_data', {}).get('basic_positions', [])
            enhanced_positions = trial.get('movement_data', {}).get('enhanced_positions', [])
            
            # Get analytics data
            analytics = trial.get('analytics') or {}
            
            row = [
                participant_id,
                condition,
                trial.get('trial_number', 0),
                trial.get('target_angle', 0),
                trial.get('rotation', 0),
                trial.get('reaction_time', 0),
                trial.get('movement_time', 0),
                trial.get('search_time', 0),
                trial.get('reach_feedback', ''),
                trial.get('hand_fb_angle', 0),
                len(basic_positions),  # Basic position count
                len(enhanced_positions),  # Enhanced position count
                trial.get('movement_data', {}).get('duration_ms', 0),
                # Enhanced analytics - all derived measures
                analytics.get('total_distance', 0),
                analytics.get('direct_distance', 0),
            ]
            trial_rows.append(row)
        
        with open(trials_path, 'w', newline='') as f:
            writer = csv.writer(f)
            header = [
                'participant_id', 'condition', 'trial_number', 'target_angle', 'rotation',
                'reaction_time', 'movement_time', 'search_time', 'reach_feedback',
                'hand_fb_angle', 'basic_samples', 'enhanced_samples', 'movement_duration_ms',
                'total_distance', 'direct_distance'
            ]
            writer.writerow(header)
            writer.writerows(trial_rows)
        print(f"✅ Trial summary: {trials_path}")
        
        # 4. Save detailed movement data 
        movement_path = os.path.join(subject_dir, f"{participant_id}_movement_detailed.csv")
        
        movement_rows = []
        for trial in dataset.get('trials', []):
            trial_num = trial.get('trial_number', 0)
            target_angle = trial.get('target_angle', 0)
            rotation = trial.get('rotation', 0)
            hand_fb_angle = trial.get('hand_fb_angle', 0) 
            
            # Get movement data from new structure
            basic_positions = trial.get('movement_data', {}).get('basic_positions', [])
            
            # Process enhanced movement samples (preferred data)
            for point_idx, point in enumerate(enhanced_positions):
                sound_params = point.get('soundParams', {})
                
                row = [
                    participant_id,
                    condition,
                    trial_num,
                    point_idx,
                    target_angle,
                    rotation,
                    hand_fb_angle,
                    point.get('time', 0),
                    point.get('x', 0),
                    point.get('y', 0),
                    sound_params.get('f1', 0),
                    sound_params.get('f2', 0),
                    sound_params.get('pitch', 0),
                    sound_params.get('vowel', ''),
                    point.get('distanceFromTarget', 0),
                    point.get('angle_from_start', 0),
                    point.get('movement_phase', '')
                ]
                movement_rows.append(row)
        
        with open(movement_path, 'w', newline='') as f:
            writer = csv.writer(f)
            header = [
                'participant_id', 'condition', 'trial_number', 'point_index', 
                'target_angle', 'rotation', 'hand_fb_angle', 'time_ms', 'x', 'y', 
                'f1', 'f2', 'pitch', 'vowel', 'distance_from_target',
                'angle_from_start', 'movement_phase'
            ]
            writer.writerow(header)
            writer.writerows(movement_rows)
        print(f"✅ Detailed movement: {movement_path}")
        print(f"   📍 Total movement samples: {len(movement_rows)}")
        
        # 6. Save screen & technical data
        screen_tech_path = os.path.join(subject_dir, f"{participant_id}_screen_technical.json")
        screen_tech_data = {
            'screen_dimensions': dataset.get('screen_dimensions', {}),
            'browser_info': dataset.get('browser_info', {}),
            'target_positioning': dataset.get('target_positioning', {}),
            'experimental_parameters': dataset.get('experimental_parameters', {})
        }
        with open(screen_tech_path, 'w') as f:
            json.dump(screen_tech_data, f, indent=2)
        print(f"✅ Screen & technical data: {screen_tech_path}")
        
        # 7. Save production metadata
        production_metadata = dataset.get('production_metadata')
        if production_metadata:
            metadata_path = os.path.join(subject_dir, f"{participant_id}_production_metadata.json")
            with open(metadata_path, 'w') as f:
                json.dump(production_metadata, f, indent=2)
            print(f"✅ Production metadata: {metadata_path}")
        
        # 8. Save experiment metadata
        experiment_metadata = dataset.get('experiment', {})
        if experiment_metadata:
            exp_path = os.path.join(subject_dir, f"{participant_id}_experiment_info.json")
            with open(exp_path, 'w') as f:
                json.dump(experiment_metadata, f, indent=2)
            print(f"✅ Experiment info: {exp_path}")
        
        print(f"🎉 All files saved to: {subject_dir}")
        return True
        
    except Exception as e:
        print(f"❌ Error saving dataset files: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

def batch_download_selected_datasets(participant_ids: List[str], output_dir: str) -> dict:
    """Download datasets for a specific list of participants."""
    print(f"🚀 Starting batch download for {len(participant_ids)} selected participants")
    print(f"📋 Participants to download: {', '.join(participant_ids)}")
    
    results = {
        'successful': 0,
        'failed': 0,
        'not_found': 0,
        'results': []
    }
    
    # First, check which participants are available (quietly)
    print(f"\n🔍 Checking availability of requested participants...")
    available_datasets = list_all_datasets(verbose=False)
    available_participant_ids = set([d['participant_id'] for d in available_datasets])
    
    requested_set = set(participant_ids)
    found_participants = requested_set.intersection(available_participant_ids)
    missing_participants = requested_set - available_participant_ids
    
    if missing_participants:
        print(f"⚠️  Warning: {len(missing_participants)} participants not found in storage:")
        for missing_id in missing_participants:
            print(f"   ❌ {missing_id}")
            results['not_found'] += 1
            results['results'].append({'participant_id': missing_id, 'status': 'not_found'})
    
    if not found_participants:
        print("❌ None of the requested participants were found in storage!")
        return results
    
    print(f"✅ Found {len(found_participants)} of {len(participant_ids)} requested participants")
    
    # Download found participants
    for i, participant_id in enumerate(found_participants, 1):
        print(f"\n📥 Processing {i}/{len(found_participants)}: {participant_id}")
        print("-" * 50)
        
        try:
            dataset = download_complete_dataset(participant_id)
            if dataset and save_dataset_to_files(dataset, output_dir):
                results['successful'] += 1
                results['results'].append({
                    'participant_id': participant_id, 
                    'status': 'success',
                    'condition': dataset['participant'].get('condition', 'unknown'),
                    'trials': len(dataset.get('trials', [])),
                    'movement_samples': dataset.get('metadata', {}).get('total_movement_samples', 0)
                })
                print(f"✅ Success: {participant_id}")
            else:
                results['failed'] += 1
                results['results'].append({'participant_id': participant_id, 'status': 'failed'})
                print(f"❌ Failed: {participant_id}")
                
        except Exception as e:
            results['failed'] += 1
            results['results'].append({'participant_id': participant_id, 'status': 'error', 'error': str(e)})
            print(f"❌ Error with {participant_id}: {str(e)}")
    
    print(f"\n🎊 Batch download complete:")
    print(f"   ✅ Successful: {results['successful']}")
    print(f"   ❌ Failed: {results['failed']}")
    print(f"   🔍 Not found: {results['not_found']}")
    print(f"   📈 Success rate: {(results['successful'] / len(found_participants) * 100):.1f}%" if found_participants else "0%")
    
    # Print summary by condition
    successful_results = [r for r in results['results'] if r['status'] == 'success']
    if successful_results:
        condition_summary = {}
        for result in successful_results:
            condition = result.get('condition', 'unknown')
            if condition not in condition_summary:
                condition_summary[condition] = {'count': 0, 'total_trials': 0, 'total_samples': 0}
            condition_summary[condition]['count'] += 1
            condition_summary[condition]['total_trials'] += result.get('trials', 0)
            condition_summary[condition]['total_samples'] += result.get('movement_samples', 0)
        
        print(f"\n📊 Summary by condition:")
        for condition, stats in condition_summary.items():
            print(f"   🎯 Condition {condition}: {stats['count']} participants, "
                  f"{stats['total_trials']} trials, {stats['total_samples']} movement samples")
    
    return results

def batch_download_all_datasets(output_dir: str) -> dict:
    """Download ALL available datasets from Firebase."""
    print(f"🚀 Starting download of ALL available datasets")
    
    # Get list of all available datasets (with verbose output for ALL mode)
    datasets = list_all_datasets(verbose=True)
    if not datasets:
        print("❌ No datasets found")
        return {'successful': 0, 'failed': 0, 'results': []}
    
    # Extract unique participant IDs
    participant_ids = list(set([d['participant_id'] for d in datasets]))
    print(f"📊 Found {len(participant_ids)} unique participants")
    
    results = {
        'successful': 0,
        'failed': 0,
        'results': []
    }
    
    for i, participant_id in enumerate(participant_ids, 1):
        print(f"\n📥 Processing {i}/{len(participant_ids)}: {participant_id}")
        print("-" * 50)
        
        try:
            dataset = download_complete_dataset(participant_id)
            if dataset and save_dataset_to_files(dataset, output_dir):
                results['successful'] += 1
                results['results'].append({
                    'participant_id': participant_id, 
                    'status': 'success',
                    'condition': dataset['participant'].get('condition', 'unknown'),
                    'trials': len(dataset.get('trials', [])),
                    'movement_samples': dataset.get('metadata', {}).get('total_movement_samples', 0)
                })
                print(f"✅ Success: {participant_id}")
            else:
                results['failed'] += 1
                results['results'].append({'participant_id': participant_id, 'status': 'failed'})
                print(f"❌ Failed: {participant_id}")
                
        except Exception as e:
            results['failed'] += 1
            results['results'].append({'participant_id': participant_id, 'status': 'error', 'error': str(e)})
            print(f"❌ Error with {participant_id}: {str(e)}")
    
    print(f"\n🎊 Complete download finished:")
    print(f"   ✅ Successful: {results['successful']}")
    print(f"   ❌ Failed: {results['failed']}")
    print(f"   📈 Success rate: {(results['successful'] / len(participant_ids) * 100):.1f}%")
    
    # Print summary by condition
    successful_results = [r for r in results['results'] if r['status'] == 'success']
    if successful_results:
        condition_summary = {}
        for result in successful_results:
            condition = result.get('condition', 'unknown')
            if condition not in condition_summary:
                condition_summary[condition] = {'count': 0, 'total_trials': 0, 'total_samples': 0}
            condition_summary[condition]['count'] += 1
            condition_summary[condition]['total_trials'] += result.get('trials', 0)
            condition_summary[condition]['total_samples'] += result.get('movement_samples', 0)
        
        print(f"\n📊 Summary by condition:")
        for condition, stats in condition_summary.items():
            print(f"   🎯 Condition {condition}: {stats['count']} participants, "
                  f"{stats['total_trials']} trials, {stats['total_samples']} movement samples")
    
    return results


# =============================================================================
# MAIN EXECUTION
# =============================================================================

if __name__ == "__main__":
    print("🔥 Complete Dataset Downloader (FLEXIBLE VERSION)")
    print("=" * 60)
    
    # Set up output directory
    output_dir = os.path.join(BASE_DATA_PATH, VERSION)
    os.makedirs(output_dir, exist_ok=True)
    
    if DOWNLOAD_MODE == 'ALL':
        print("🌟 DOWNLOADING ALL AVAILABLE DATA")
        print("=" * 60)
        
        # Download all datasets
        batch_results = batch_download_all_datasets(output_dir)
        
        print(f"\n🎉 ALL DATA DOWNLOAD COMPLETE!")
        print(f"📁 All files saved to: {output_dir}")
        print(f"✅ Successfully downloaded: {batch_results['successful']} participants")
        print(f"❌ Failed downloads: {batch_results['failed']} participants")
        
    elif DOWNLOAD_MODE == 'BATCH':
        print("📋 DOWNLOADING SELECTED BATCH OF PARTICIPANTS")
        print("=" * 60)
        
        if not BATCH_PARTICIPANT_IDS:
            print("❌ Error: BATCH_PARTICIPANT_IDS list is empty!")
            print("   Please add participant IDs to the BATCH_PARTICIPANT_IDS list in the configuration section.")
            exit()
        
        # Download selected participants
        batch_results = batch_download_selected_datasets(BATCH_PARTICIPANT_IDS, output_dir)
        
        # Create comprehensive analysis summary for downloaded participants
        if batch_results['successful'] > 0:
            create_comprehensive_analysis_summary(output_dir)
        
        print(f"\n🎉 BATCH DOWNLOAD COMPLETE!")
        print(f"📁 Files saved to: {output_dir}")
        print(f"✅ Successfully downloaded: {batch_results['successful']} participants")
        print(f"❌ Failed downloads: {batch_results['failed']} participants")
        print(f"🔍 Not found: {batch_results['not_found']} participants")
        
    elif DOWNLOAD_MODE == 'SINGLE':
        print(f"🎯 DOWNLOADING SINGLE DATASET FOR: {SUBJECT_ID}")
        print("=" * 60)
        
        # Download single subject
        dataset = download_complete_dataset(SUBJECT_ID)
        
        if dataset:
            success = save_dataset_to_files(dataset, output_dir)
            
            if success:
                print(f"\n🎉 Download complete!")
                print(f"📁 Files saved to: {output_dir}/{SUBJECT_ID}_condition_{dataset['participant'].get('condition', 'unknown')}/")
            else:
                print(f"\n❌ Error saving files")
        else:
            print(f"\n❌ Failed to download dataset for {SUBJECT_ID}")
    
    else:
        print(f"❌ Error: Invalid DOWNLOAD_MODE '{DOWNLOAD_MODE}'")
        print("   Valid options are: 'ALL', 'BATCH', 'SINGLE'")
        exit()