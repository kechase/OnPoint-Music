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
        
        # For training, preserve original order (don't randomize)
        # For testing, randomize the order
        if is_training:
            trial_order = list(range(len(rows)))
        else:
            # Group testing rows by direction (angle)
            angle_groups = {}
            for row in rows:
                angle = int(row[3])
                if angle not in angle_groups:
                    angle_groups[angle] = []
                angle_groups[angle].append(row)

            # Create balanced blocks of 8 (2 trials per angle per block)
            balanced_trials = []
            while all(len(angle_groups[angle]) >= 2 for angle in angle_groups):
                block = []
                angles_in_block = list(angle_groups.keys())
                random.shuffle(angles_in_block)  # Optional shuffle within block
                for angle in angles_in_block:
                    block.append(angle_groups[angle].pop())
                    block.append(angle_groups[angle].pop())
                random.shuffle(block)  # Optional shuffle of block order
                balanced_trials.extend(block)

            # Add any remaining trials that didn't fit into a complete block
            leftovers = [trial for trials in angle_groups.values() for trial in trials]
            random.shuffle(leftovers)
            balanced_trials.extend(leftovers)
            
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
csvFilePath = '/Users/katie/Documents/workspace/OnPoint-Music/build_tools/csv_tgt_files/csv_tgt_file_2025-05-27.csv'

#### MANUALLY CREATE THIS NOT-YET-REAL FILEPATH (SO THIS SCRIPT WILL CREATE and DROP THE FILE THERE)
jsonFilePath = '/Users/katie/Documents/workspace/OnPoint-Music/public/tgt_files/csv_tgt_file_2025-05-27.json'

# Run the conversion
jsonFromCsv(csvFilePath, jsonFilePath)

# Print completion message
print(f"CSV file converted to JSON and saved to {jsonFilePath}")


