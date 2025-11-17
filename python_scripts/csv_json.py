import csv
import json
import random

# This script reads a CSV file containing trial data, processes it to separate training and testing conditions, and converts it into a structured JSON format.
# Update the `csvFilePath` and `jsonFilePath` with the appropriate file paths before running the script.
# Has a balanced block structure for testing trials, ensures each block contains one trial per angle.

def jsonFromCsv(csvFilePath, jsonFilePath):
    # Read the CSV file
    with open(csvFilePath, 'r') as file:
        reader = csv.reader(file)
        headings = next(reader)
        # separate rows by condition
        condition_A_training_rows = []
        condition_B_training_rows = []
        testing_rows = []
        for row in reader:
            if row[1] == 'A_training':
                condition_A_training_rows.append(row)
            elif row[1] == 'B_training':
                condition_B_training_rows.append(row)
            elif row[1] == 'testing':
                testing_rows.append(row)
    # Close the file after reading

    print(f"Found {len(condition_A_training_rows)} A_training rows")
    print(f"Found {len(condition_B_training_rows)} B_training rows")
    print(f"Found {len(testing_rows)} testing rows")
    # Function to create condition-specific JSON data
    
    def create_condition_data(rows, is_training=False, add_pre_instructions=False):
        jsonData = {}
        trialNums = {}
        aimingLandmarks = {}
        onlineFB = {}
        endpointFB = {}
        rotation = {}
        tgtDistance = {}
        anglesDict = {}
        betweenBlocks = {}
        targetJump = {}
        
        # For training, randomize within blocks of 4 trials
        if is_training:
            # Group training rows by angle to identify unique angles
            angle_groups = {}
            for row in rows:
                angle = int(row[3])
                if angle not in angle_groups:
                    angle_groups[angle] = []
                angle_groups[angle].append(row)
            
            num_angles = len(angle_groups)
            print(f"\nTraining has {num_angles} unique angles")
            
            # Determine number of blocks (assuming equal repetitions per angle)
            # Each block should have one trial per angle
            num_blocks = len(rows) // num_angles
            print(f"Creating {num_blocks} randomized training blocks")
            
            # Create blocks by taking one trial from each angle group
            randomized_trials = []
            for block_num in range(num_blocks):
                block = []
                for angle in sorted(angle_groups.keys()):
                    if len(angle_groups[angle]) > block_num:
                        block.append(angle_groups[angle][block_num])
                
                # Randomize the order within this block
                random.shuffle(block)
                randomized_trials.extend(block)
                print(f"  Block {block_num + 1}: angles {[int(trial[3]) for trial in block]}")
            
            rows = randomized_trials
            trial_order = list(range(len(rows)))
        
        # For testing, randomize within blocks of 8 angles
        else:
            # Group testing rows by direction (angle)
            angle_groups = {}
            for row in rows:
                angle = int(row[3])
                if angle not in angle_groups:
                    angle_groups[angle] = []
                angle_groups[angle].append(row)

            # Create balanced blocks of 8 (1 trials per angle per block)
            balanced_trials = []
            num_angles = len(angle_groups)

            # Continue while we have at least one trial for each angle
            while all(len(angle_groups[angle]) >= 1 for angle in angle_groups):
                block = []
                angles_in_block = list(angle_groups.keys())
                random.shuffle(angles_in_block)  # Optional shuffle within block
                
                # Take exactly one trial from each angle group
                for angle in angles_in_block:
                    if angle_groups[angle]:
                        block.append(angle_groups[angle].pop())
                random.shuffle(block)  # Shuffle the block to randomize order
                balanced_trials.extend(block)
                
            # If any angle groups still have trials left, add them to the end
            # This ensures that we don't leave any trials behind
            # This will not create a balanced block, but will ensure all trials are included
            leftovers = [trial for trials in angle_groups.values() for trial in trials]
            random.shuffle(leftovers)
            balanced_trials.extend(leftovers)

            # Debug: Analyze the block structure
            print("\n=== BLOCK ANALYSIS ===")
            print(f"Total balanced trials: {len(balanced_trials)}")

            # Determine expected block size (number of unique angles)
            all_angles = set()
            for trial in balanced_trials:
                all_angles.add(int(trial[3]))  # Assuming angle is in column 3
            expected_block_size = len(all_angles)
            print(f"Number of unique angles: {expected_block_size}")
            print(f"Unique angles: {sorted(list(all_angles))}")

            # Calculate number of complete blocks
            num_complete_blocks = len(balanced_trials) // expected_block_size
            leftover_trials = len(balanced_trials) % expected_block_size
            print(f"Number of complete blocks: {num_complete_blocks}")
            print(f"Leftover trials: {leftover_trials}")

            # Analyze each block
            all_blocks_valid = True
            for block_num in range(num_complete_blocks):
                start_idx = block_num * expected_block_size
                end_idx = start_idx + expected_block_size
                block_trials = balanced_trials[start_idx:end_idx]
                
                # Get angles in this block
                block_angles = [int(trial[3]) for trial in block_trials]
                unique_block_angles = set(block_angles)
                
                # Check if block contains all angles
                has_all_angles = len(unique_block_angles) == expected_block_size
                contains_all = unique_block_angles == all_angles
                
                if not contains_all:
                    all_blocks_valid = False
                
                print(f"Block {block_num + 1}: {sorted(list(unique_block_angles))} - Contains all 8 angles: {'YES' if contains_all else 'NO'}")

            # Overall summary
            print(f"\nSUMMARY:")
            print(f"All {num_complete_blocks} blocks contain all {expected_block_size} angles: {'YES' if all_blocks_valid else 'NO'}")

            if leftover_trials > 0:
                leftover_start = num_complete_blocks * expected_block_size
                leftover_angles = [int(trial[3]) for trial in balanced_trials[leftover_start:]]
                print(f"Leftover trials angles: {sorted(leftover_angles)}")

            print("=== END BLOCK ANALYSIS ===\n")
            
            rows = balanced_trials
            trial_order = list(range(len(rows)))

        rowCount = 0
        for trial_index in trial_order:
            row = rows[trial_index]
            key = str(rowCount)
            trialNums[key] = int(row[0])
            aimingLandmarks[key] = int(row[2])
            anglesDict[key] = int(row[3])
            rotation[key] = float(row[4])
            onlineFB[key] = int(row[5])
            endpointFB[key] = int(row[6])
            tgtDistance[key] = int(row[7])
            betweenBlocks[key] = float(row[8])
            targetJump[key] = float(row[9])
            rowCount += 1

        if add_pre_instructions and is_training:
            betweenBlocks["0"] = 1.0

        # Set the last training trial to trigger Phase 2 transition
        if is_training:
            last_trial_key = str(rowCount - 1)
            betweenBlocks[last_trial_key] = 2.0
            print(f"Set training trial {last_trial_key} (last trial) to between_blocks = 2.0 (Phase 2 transition)")

        jsonData = {
            "numtrials": rowCount,
            "trialnum": trialNums,
            "aiming_landmarks": aimingLandmarks,
            "online_fb": onlineFB,
            "endpoint_feedback": endpointFB,
            "rotation": rotation,
            "tgt_angle": anglesDict,
            "tgt_distance": tgtDistance,
            "between_blocks": betweenBlocks,
            "target_jump": targetJump
        }
        return jsonData

    final_json = {
        "conditionA": {
            "training": create_condition_data(condition_A_training_rows, is_training=True, add_pre_instructions=True),
            "testing": create_condition_data(testing_rows, is_training=False)
        },
        "conditionB": {
            "training": create_condition_data(condition_B_training_rows, is_training=True, add_pre_instructions=True),
            "testing": create_condition_data(testing_rows, is_training=False)
        }
    }

    with open(jsonFilePath, 'w') as outfile:
        json.dump(final_json, outfile, indent=2)

    print("CSV converted to JSON with balanced testing blocks.")


#### MANUALLY ENTER THE REAL PATH to THIS CSV FILE
csvFilePath = '/Users/katie/Documents/workspace/OnPoint-Music/build_tools/csv_tgt_files/csv_tgt_file_2025-11-17.csv'

#### MANUALLY CREATE THIS NOT-YET-REAL FILEPATH (SO THIS SCRIPT WILL CREATE and DROP THE FILE THERE)
jsonFilePath = '/Users/katie/Documents/workspace/OnPoint-Music/public/tgt_files/csv_tgt_file_2025-11-17.json'

# Run the conversion
jsonFromCsv(csvFilePath, jsonFilePath)

# Print completion message
print(f"CSV file converted to JSON and saved to {jsonFilePath}")


