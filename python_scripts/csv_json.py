import csv
import json
import random

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
            trial_order = list(range(len(rows)))
            random.shuffle(trial_order)
        
        rowCount = 0
        for trial_index in trial_order:
            if trial_index < len(rows):  # Safety check
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

        # **NEW**: Add pre-training instructions
        if add_pre_instructions and is_training:
            # Set the first trial to show training instructions (bb_mess = 1)
            betweenBlocks["0"] = 1.0
        
        jsonData["numtrials"] = rowCount
        jsonData["trialnum"] = trialNums
        jsonData["aiming_landmarks"] = aimingLandmarks
        jsonData["online_fb"] = onlineFB
        jsonData["endpoint_feedback"] = endpointFB
        jsonData["rotation"] = rotation
        jsonData["tgt_angle"] = anglesDict
        jsonData["tgt_distance"] = tgtDistance
        jsonData["between_blocks"] = betweenBlocks
        jsonData["target_jump"] = targetJump
        
        return jsonData
    
    # Create JSON data for each condition
    final_json = {
        "conditionA": {
            "training": create_condition_data(condition_A_training_rows, is_training=True, add_pre_instructions=True),
            "testing": create_condition_data(testing_rows, is_training=False)
        },
        "conditionB": {
            "training": create_condition_data(condition_B_training_rows, is_training=True, add_pre_instructions=True),
            "testing": create_condition_data(testing_rows, is_training=False)
        },
        "instructions": {
            "conditionA": [
                "Training Phase Instructions:",
                "When the center circle turns green,",
                "Move your cursor to the blue target."
                "Listen for a TONE or a VOWEL SOUND as you move",
                "This is the sound of the instrument!",
                "Press 'b' when you are ready to proceed."
            ],
            "conditionB": [
                "Training Phase Instructions:",
                "When the center circle turns green,",
                "Move your cursor to the blue target."
                "Listen to the sound that plays as you move,",
                "This is the sound of the instrument!",
                "Press 'b' when you are ready to proceed."
            ],
            "testing": [
                "Testing Phase Instructions:",
                "Listen to the sound, then move in the direction that recreates the sound.",
                "Don't worry if you miss one -- it takes a little practice!",
                "Press 'a' to continue."
            ]
        }
    }
    
    # Write to JSON file
    with open(jsonFilePath, 'w') as outfile:
        json.dump(final_json, outfile, indent=2)

# Validation and summary
    print("\nJSON Structure Created:")
    print(f"Condition A Training: {final_json['conditionA']['training']['numtrials']} trials")
    print(f"Condition A Testing: {final_json['conditionA']['testing']['numtrials']} trials")
    print(f"Condition B Training: {final_json['conditionB']['training']['numtrials']} trials")
    print(f"Condition B Testing: {final_json['conditionB']['testing']['numtrials']} trials")
    
    # Show between_blocks for validation
    print("\nCondition A Training between_blocks:", [final_json['conditionA']['training']['between_blocks'][str(i)] 
                                                   for i in range(final_json['conditionA']['training']['numtrials'])])
    print("Condition B Training between_blocks:", [final_json['conditionB']['training']['between_blocks'][str(i)] 
                                                   for i in range(final_json['conditionB']['training']['numtrials'])])


#### MANUALLY ENTER THE REAL PATH to THIS CSV FILE
csvFilePath = '/Users/katie/Documents/workspace/OnPoint-Music/csv_tgt_files/csv_tgt_file_2025-05-21.csv'

#### MANUALLY CREATE THIS NOT-YET-REAL FILEPATH (SO THIS SCRIPT WILL CREATE and DROP THE FILE THERE)
jsonFilePath = '/Users/katie/Documents/workspace/OnPoint-Music/public/tgt_files/csv_tgt_file_2025-05-21.json'

# Run the conversion
jsonFromCsv(csvFilePath, jsonFilePath)

# Print completion message
print(f"CSV file converted to JSON and saved to {jsonFilePath}")


