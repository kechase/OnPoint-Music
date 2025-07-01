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
SUBJECT_ID = 'katiekatie'  # Update this
BASE_DATA_PATH = '/Users/katie/Documents/1-Product/Research/OnPoint-Music-Admin-and-Data/data_storage'
VERSION = 'production_v1'  # Updated for production version
SERVICE_ACCOUNT_PATH = "/Users/katie/Documents/workspace/z-Security-Keys/onpoint-music-security-key.json"
STORAGE_BUCKET = "onpoint-music.firebasestorage.app"
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

def list_all_datasets():
    """List all complete datasets in Firebase Storage."""
    try:
        print("📂 Scanning for complete datasets in Firebase Storage...")
        
        blobs = list(bucket.list_blobs(prefix='production_datasets/'))
        
        if not blobs:
            print("❌ No complete datasets found")
            return []
        
        datasets = []
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
            
            print(f"   👤 {participant_id:<12} | 🎯 {condition:<2} | 🧪 {trial_count:<3} | 📊 {size_mb:>6.1f} MB | ⏰ {created}")
        
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
        datasets = list_all_datasets()
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
        participant_path = os.path.join(subject_dir, f"{participant_id}_participant.csv")
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
        trials_path = os.path.join(subject_dir, f"{participant_id}_trials.csv")
        
        trial_rows = []
        for trial in dataset.get('trials', []):
            # Get movement data counts
            basic_positions = trial.get('movement_data', {}).get('basic_positions', [])
            enhanced_positions = trial.get('movement_data', {}).get('enhanced_positions', [])
            
            # Get analytics data
            analytics = trial.get('analytics', {})
            
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
                # Enhanced analytics
                analytics.get('path_efficiency', 0),
                analytics.get('total_distance', 0),
                analytics.get('direct_distance', 0),
                analytics.get('avg_velocity', 0),
                analytics.get('max_acceleration', 0),
                analytics.get('pause_count', 0),
                analytics.get('avg_pause_duration', 0),
                analytics.get('quadrant_changes', 0),
                analytics.get('direction_changes', 0),
                analytics.get('avg_gradient_alignment', 0),
                analytics.get('behavior_classification', ''),
                len(trial.get('learning_events', []))
            ]
            trial_rows.append(row)
        
        with open(trials_path, 'w', newline='') as f:
            writer = csv.writer(f)
            header = [
                'participant_id', 'condition', 'trial_number', 'target_angle', 'rotation',
                'reaction_time', 'movement_time', 'search_time', 'reach_feedback',
                'hand_fb_angle', 'basic_samples', 'enhanced_samples', 'movement_duration_ms',
                'path_efficiency', 'total_distance', 'direct_distance', 
                'avg_velocity', 'max_acceleration', 'pause_count', 'avg_pause_duration',
                'quadrant_changes', 'direction_changes', 'avg_gradient_alignment',
                'behavior_classification', 'learning_events'
            ]
            writer.writerow(header)
            writer.writerows(trial_rows)
        print(f"✅ Trial summary: {trials_path}")
        
        # 4. Save detailed movement data (updated structure)
        movement_path = os.path.join(subject_dir, f"{participant_id}_movement_detailed.csv")
        
        movement_rows = []
        for trial in dataset.get('trials', []):
            trial_num = trial.get('trial_number', 0)
            target_angle = trial.get('target_angle', 0)
            rotation = trial.get('rotation', 0)
            
            # Get movement data from new structure
            basic_positions = trial.get('movement_data', {}).get('basic_positions', [])
            enhanced_positions = trial.get('movement_data', {}).get('enhanced_positions', [])
            
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
                    point.get('time', 0),
                    point.get('x', 0),
                    point.get('y', 0),
                    point.get('velocity', 0),
                    point.get('acceleration', 0),
                    point.get('isPause', False),
                    point.get('quadrant', 0),
                    sound_params.get('f1', 0),
                    sound_params.get('f2', 0),
                    sound_params.get('pitch', 0),
                    sound_params.get('vowel', ''),
                    point.get('distanceFromTarget', 0)
                ]
                movement_rows.append(row)
        
        with open(movement_path, 'w', newline='') as f:
            writer = csv.writer(f)
            header = [
                'participant_id', 'condition', 'trial_number', 'point_index', 
                'target_angle', 'rotation', 'time_ms', 'x', 'y', 
                'velocity', 'acceleration', 'is_pause', 'quadrant',
                'f1', 'f2', 'pitch', 'vowel', 'distance_from_target'
            ]
            writer.writerow(header)
            writer.writerows(movement_rows)
        print(f"✅ Detailed movement: {movement_path}")
        print(f"   📍 Total movement samples: {len(movement_rows)}")
        
        # 5. Save learning events (NEW)
        learning_events = dataset.get('learning_events', [])
        if learning_events:
            learning_path = os.path.join(subject_dir, f"{participant_id}_learning_events.csv")
            
            learning_rows = []
            for event in learning_events:
                row = [
                    participant_id,
                    condition,
                    event.get('type', ''),
                    event.get('time', 0),
                    event.get('from', ''),
                    event.get('to', ''),
                    event.get('confidence', 0)
                ]
                learning_rows.append(row)
            
            with open(learning_path, 'w', newline='') as f:
                writer = csv.writer(f)
                header = ['participant_id', 'condition', 'event_type', 'time_ms', 
                         'from_strategy', 'to_strategy', 'confidence']
                writer.writerow(header)
                writer.writerows(learning_rows)
            print(f"✅ Learning events: {learning_path}")
        
        # 6. Save enhanced analytics (NEW)
        enhanced_analytics = dataset.get('enhanced_analytics')
        if enhanced_analytics:
            analytics_path = os.path.join(subject_dir, f"{participant_id}_enhanced_analytics.json")
            with open(analytics_path, 'w') as f:
                json.dump(enhanced_analytics, f, indent=2)
            print(f"✅ Enhanced analytics: {analytics_path}")
        
        # 7. Save production metadata (NEW)
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

def batch_download_datasets(subject_ids: List[str], output_dir: str) -> dict:
    """Download datasets for multiple subjects."""
    print(f"🚀 Starting batch download for {len(subject_ids)} subjects")
    
    results = {
        'successful': 0,
        'failed': 0,
        'results': []
    }
    
    for i, subject_id in enumerate(subject_ids, 1):
        print(f"\n📥 Processing {i}/{len(subject_ids)}: {subject_id}")
        print("-" * 50)
        
        try:
            dataset = download_complete_dataset(subject_id)
            if dataset and save_dataset_to_files(dataset, output_dir):
                results['successful'] += 1
                results['results'].append({
                    'subject_id': subject_id, 
                    'status': 'success',
                    'condition': dataset['participant'].get('condition', 'unknown'),
                    'trials': len(dataset.get('trials', [])),
                    'movement_samples': dataset.get('metadata', {}).get('total_movement_samples', 0)
                })
                print(f"✅ Success: {subject_id}")
            else:
                results['failed'] += 1
                results['results'].append({'subject_id': subject_id, 'status': 'failed'})
                print(f"❌ Failed: {subject_id}")
                
        except Exception as e:
            results['failed'] += 1
            results['results'].append({'subject_id': subject_id, 'status': 'error', 'error': str(e)})
            print(f"❌ Error with {subject_id}: {str(e)}")
    
    print(f"\n🎊 Batch download complete:")
    print(f"   ✅ Successful: {results['successful']}")
    print(f"   ❌ Failed: {results['failed']}")
    print(f"   📈 Success rate: {(results['successful'] / len(subject_ids) * 100):.1f}%")
    
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

def create_analysis_summary(output_dir: str) -> None:
    """Create a summary analysis CSV across all participants."""
    try:
        print(f"\n📊 Creating analysis summary...")
        
        # Find all participant directories
        summary_data = []
        
        for item in os.listdir(output_dir):
            item_path = os.path.join(output_dir, item)
            if os.path.isdir(item_path) and '_condition_' in item:
                participant_id = item.split('_condition_')[0]
                condition = item.split('_condition_')[1]
                
                # Try to read trial summary
                trials_file = os.path.join(item_path, f"{participant_id}_trials.csv")
                if os.path.exists(trials_file):
                    df = pd.read_csv(trials_file)
                    
                    # Calculate summary statistics
                    summary = {
                        'participant_id': participant_id,
                        'condition': condition,
                        'total_trials': len(df),
                        'avg_reaction_time': df['reaction_time'].mean(),
                        'avg_movement_time': df['movement_time'].mean(),
                        'avg_path_efficiency': df['path_efficiency'].mean(),
                        'avg_velocity': df['avg_velocity'].mean(),
                        'total_learning_events': df['learning_events'].sum(),
                        'total_movement_samples': df['enhanced_samples'].sum()
                    }
                    summary_data.append(summary)
        
        if summary_data:
            summary_df = pd.DataFrame(summary_data)
            summary_path = os.path.join(output_dir, 'analysis_summary.csv')
            summary_df.to_csv(summary_path, index=False)
            print(f"✅ Analysis summary: {summary_path}")
            
            # Print quick stats
            print(f"   📈 Total participants: {len(summary_df)}")
            print(f"   🎯 Conditions: {summary_df['condition'].unique()}")
            print(f"   🧪 Total trials: {summary_df['total_trials'].sum()}")
            print(f"   📍 Total movement samples: {summary_df['total_movement_samples'].sum()}")
        
    except Exception as e:
        print(f"❌ Error creating analysis summary: {str(e)}")

# =============================================================================
# MAIN EXECUTION
# =============================================================================

if __name__ == "__main__":
    print("🔥 Complete Dataset Downloader (Production Version)")
    print("=" * 60)
    
    # List all available datasets
    print("📂 Available datasets:")
    datasets = list_all_datasets()
    
    if not datasets:
        print("❌ No datasets found in Firebase Storage")
        exit()
    
    print(f"\n🎯 Downloading dataset for: {SUBJECT_ID}")
    
    # Download single subject
    dataset = download_complete_dataset(SUBJECT_ID)
    
    if dataset:
        output_dir = os.path.join(BASE_DATA_PATH, 'complete_datasets', VERSION)
        success = save_dataset_to_files(dataset, output_dir)
        
        if success:
            print(f"\n🎉 Download complete!")
            print(f"📁 Files saved to: {output_dir}/{SUBJECT_ID}_condition_{dataset['participant'].get('condition', 'unknown')}/")
        else:
            print(f"\n❌ Error saving files")
    else:
        print(f"\n❌ Failed to download dataset for {SUBJECT_ID}")
    
    # Uncomment for batch download:
    # subject_list = ["123456789", "987654321", "456789123"]
    # batch_results = batch_download_datasets(subject_list, output_dir)
    # create_analysis_summary(output_dir)