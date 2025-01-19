"""
This script is for generating JSON target files directly, which is the form used in the experiment. 
To implement target jump, clamp, or online feedback make appropriate changes in the area flagged by the **TODO** comment.
"""
import json
import random

def generateTargetAngles(numTargets):
    """
    temporary usage of this function for non-evenly spaced targets
    """
    angleList = [45, 135]
    # if (len(angleList) != numTargets):
    #     raise Exception('Target file does not have the right amount of targets. Should have ' + str(numTargets) + ' targets, but only has ' + str(len(angleList)))
    
    return angleList

# TODO Change numTargets to array list of angle targets instead.
# TODO numDemoCycles and demoTargetAngle is not a good parameter input. Deprecate them if possible.
def generateJSON(numTargets, cycleCount, cycleDistribution, rotationAngle, targetDistance, numDemoCycles, demoTargetAngle):
    # Ensure non demo cycles add up
    if (cycleCount != sum(cycleDistribution)):
        raise Exception('Number of non demo cycles do not add up. Should have ' + str(cycleCount) + ' cycles, but has ' + str(sum(cycleDistribution)) + '.')
    
    # What's the constraint for the fixed size here?
    if (len(cycleDistribution) != 4):
        raise Exception('Incorrect amount of entries in cycle distribution, should have 4 but has ' + str(len(cycleDistribution)) + '.')
    
    jsonData = {}
    targetAngles = generateTargetAngles(numTargets)
    numTrials = numTargets * cycleCount # block size    # 2 * 8 = 16

    numDemoTrials = numDemoCycles * numTargets  # 2 * 2 = 4
    totalNumTrials = numTrials + numDemoTrials # 16 * 4 = 64
    jsonData["numtrials"] = totalNumTrials # data store is redundant, may not be required.
    trialNums = {}
    aimingLandmarks = {}
    onlineFB = {}
    endpointFB = {}
    rotation = {}
    clampedFB = {}
    tgtDistance = {}
    angles = []
    anglesDict = {}
    betweenBlocks = {}
    targetJump = {}
    
    # Breakpoints between phases
    base_no_fb = cycleDistribution[0] * numTargets              # 2 * 2 = 4
    base_fb = base_no_fb + (cycleDistribution[1] * numTargets)  # 4 + ( 2 * 2 ) = 8
    demo = base_fb + numDemoTrials                  # 8 + 4 = 12
    rotate = demo + (cycleDistribution[2] * numTargets) # 12 + ( 2 * 2 ) = 16 rotations?
    aftereffect_no_fb = rotate + (cycleDistribution[3] * numTargets) # 16 + ( 2 * 2 ) = 20 rotations?
    if (totalNumTrials != aftereffect_no_fb): # This have no meaningful effect on code at this point?
        raise Exception('Number of reaches do not add up. Should have ' + str(totalNumTrials) + ' targets, but only has ' + str(aftereffect_no_fb) + '.')

    # Update the blocks whenever numTrials is changed.
    # **TODO** Update values from 0 --> 1 to toggle effects
    # currently in index.js we're offseting this value to the target rotation
    # For target jump, 1 ==> jump to target, any other integer != 0 or 1 ==> jump away from target to that degree
    for i in range(totalNumTrials):
        trialNums[i] = i + 1
        aimingLandmarks[i] = 0
        tgtDistance[i] = targetDistance
        if i < base_no_fb :
            onlineFB[i] = 0
            endpointFB[i] = 0
            rotation[i] = float(0)
            clampedFB[i] = float(0)
            targetJump[i] = float(0)
        elif i < base_fb :
            onlineFB[i] = 1
            endpointFB[i] = 1
            rotation[i] = float(0)
            clampedFB[i] = float(0)
            targetJump[i] = float(0)
        elif i < demo:
            onlineFB[i] = 1
            endpointFB[i] = 1
            rotation[i] = float(rotationAngle)
            clampedFB[i] = float(1)
            targetJump[i] = float(0)
        elif i < rotate : 
            onlineFB[i] = 1
            endpointFB[i] = 1
            rotation[i] = float(rotationAngle)
            clampedFB[i] = float(1)
            targetJump[i] = float(0)
        else:
            onlineFB[i] = 0
            endpointFB[i] = 0
            rotation[i] = float(0)
            clampedFB[i] = float(0)
            targetJump[i] = float(0)

    # Shuffle the targets 
    for i in range(totalNumTrials):
        if i % numTargets == 0:
            angles = targetAngles
            random.shuffle(angles)
        anglesDict[i] = float(angles[i % len(angles)])
        betweenBlocks[str(i)] = 0.0

    # Set up all demo targets
    for i in range(base_fb, demo):
        anglesDict[i] = float(demoTargetAngle)
    for i in range(base_fb - 1, demo - 1):
        betweenBlocks[str(i)] = 6
    
    # TODO Find a way to create a Trial Block that can have these kind of behaviour, instead of custom unique between blocks.
    # Should automatically be updated by now
    # 1 = baseline feedback instructions
    # 2 = experiment paradigm understanding instructions
    # 3 = after effect no feedback instructions
    # 4 = attention check press 'a'
    # 5 = attention check press 'e'
    # 6 = demo instructions
    betweenBlocks[str(base_no_fb - 1)] = 1
    betweenBlocks[str(demo - 1)] = 2
    betweenBlocks[str(rotate - 1)] = 3
    # TODO Let client insert messages for in between blocks in JSON format instead of index.js. Let index.js display it for us.
    # Attention check blocks // 5 = press 'a', 4 == press 'e', randomly pick spots before 50 trials, double check with index.js for consistency.
    if (totalNumTrials > 39):
        betweenBlocks[str(6)] = 4
        betweenBlocks[str(14)] = 5
        betweenBlocks[str(24)] = 4
        betweenBlocks[str(39)] = 5


    jsonData["trialnum"] = trialNums
    jsonData["aiming_landmarks"] = aimingLandmarks
    jsonData["online_fb"] = onlineFB
    jsonData["endpoint_feedback"] = endpointFB
    jsonData["rotation"] = rotation
    jsonData["clamped_fb"] = clampedFB
    jsonData["tgt_angle"] = anglesDict
    jsonData["tgt_distance"] = tgtDistance
    # this could be used as a input message block message. Customize your message here?
    jsonData["between_blocks"] = betweenBlocks
    jsonData["target_jump"] = targetJump
 
    for key in jsonData.keys():
        print ("key: ", key)
        print ("value: ", jsonData[key])
        print ("")

    with open('testShort.json', 'w') as outfile:
        json.dump(jsonData, outfile)


# TODO Clarify what this nonDemoCycles is?
nonDemoCycles = [2, 2, 2, 2]
generateJSON(2, 8, nonDemoCycles, -10, 80, 2, 270) 
"""
The above call 'generateJSON(2, 8, nonDemoCycles, -10, 80, 2, 270)' will generate a target file with:
- 2 targets
- 8 cycles (8 x 2 = 16 reaches) distributed into cycles of 2 (split by nonDemoCycles)
- ( base no feedback, base feedback, rotate, aftereffect no feedback )  TODO - What does all of this means?
- -10 rotation angle (10 degrees clockwise)
- TargetDistance is not obsolete
- 2 demo trials at 270 degrees (straight down)
"""

