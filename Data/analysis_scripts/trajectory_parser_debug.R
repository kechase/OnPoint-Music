library(jsonlite)
library(dplyr)
library(ggplot2)
library(tidyverse)
library(gridExtra)
library(stringr)

# Load participant data
cat("Loading data...\n")
my_data <- read.csv("~/Documents/workspace/OnPoint-Music/Data/1trials_march162025.csv") 

# Clean column names
names(my_data) <- gsub(" ", ".", names(my_data))

# Check if Hand_Path column exists
if(!"Hand_Path" %in% names(my_data)) {
  cat("ERROR: No 'Hand_Path' column found in the data.\n")
  cat("Available columns are:\n")
  print(names(my_data))
  stop("Hand_Path column missing")
}

# Debug: print some info about the Hand_Path column
cat("Hand_Path column found.\n")
cat("Number of non-NA Hand_Path entries:", sum(!is.na(my_data$Hand_Path)), "\n")

# Show sample of Hand_Path data
if(any(!is.na(my_data$Hand_Path))) {
  sample_idx <- which(!is.na(my_data$Hand_Path))[1]
  cat("\nSample Hand_Path content (first 300 chars):\n")
  cat(substr(my_data$Hand_Path[sample_idx], 1, 300), "...\n\n")
} else {
  cat("WARNING: All Hand_Path entries are NA\n")
}

# Function to extract trajectory points with detailed debug info
extract_hand_path_points <- function(json_str, trial_idx) {
  # Check if input is valid
  if(!is.character(json_str) || nchar(json_str) < 10) {
    cat("  Trial", trial_idx, "- Invalid JSON string (too short or not a string)\n")
    return(NULL)
  }
  
  # Debug: print a small sample of the JSON
  cat("  Trial", trial_idx, "- JSON sample:", substr(json_str, 1, 50), "...\n")
  
  # First, fix any JSON formatting issues
  fixed_json <- gsub("'", "\"", json_str)
  
  # Try to parse the JSON
  parsed_data <- tryCatch({
    fromJSON(fixed_json)
  }, error = function(e) {
    cat("  Trial", trial_idx, "- Error parsing JSON:", e$message, "\n")
    return(NULL)
  })
  
  if(is.null(parsed_data)) {
    cat("  Trial", trial_idx, "- Failed to parse JSON\n")
    return(NULL)
  }
  
  # Debug: Show what we parsed
  cat("  Trial", trial_idx, "- Successfully parsed JSON. Keys found:", 
      paste(head(names(parsed_data), 5), collapse=", "), "...\n")
  
  # Now extract the points from the parsed data
  point_data <- data.frame(x = numeric(), y = numeric(), time = numeric())
  
  # Count how many points there are (look for count field)
  point_count <- if("count" %in% names(parsed_data)) parsed_data$count else 0
  cat("  Trial", trial_idx, "- Points count:", point_count, "\n")
  
  # Extract first point if available
  if(all(c("first_x", "first_y") %in% names(parsed_data))) {
    first_time <- if("first_time" %in% names(parsed_data)) parsed_data$first_time else 0
    point_data <- rbind(point_data, data.frame(
      x = parsed_data$first_x,
      y = parsed_data$first_y,
      time = first_time
    ))
    cat("  Trial", trial_idx, "- Added first point:", 
        parsed_data$first_x, ",", parsed_data$first_y, "\n")
  } else {
    cat("  Trial", trial_idx, "- No first point found\n")
  }
  
  # Extract sample points
  sample_count <- 0
  for(i in 0:10) {  # Look for up to 10 samples
    x_key <- paste0("sample_", i, "_x")
    y_key <- paste0("sample_", i, "_y")
    time_key <- paste0("sample_", i, "_time")
    
    if(all(c(x_key, y_key) %in% names(parsed_data))) {
      sample_time <- if(time_key %in% names(parsed_data)) parsed_data[[time_key]] else i * 100
      point_data <- rbind(point_data, data.frame(
        x = parsed_data[[x_key]],
        y = parsed_data[[y_key]],
        time = sample_time
      ))
      sample_count <- sample_count + 1
    }
  }
  cat("  Trial", trial_idx, "- Added", sample_count, "sample points\n")
  
  # Extract last point if available
  if(all(c("last_x", "last_y") %in% names(parsed_data))) {
    last_time <- if("last_time" %in% names(parsed_data)) parsed_data$last_time else 1000
    point_data <- rbind(point_data, data.frame(
      x = parsed_data$last_x,
      y = parsed_data$last_y,
      time = last_time
    ))
    cat("  Trial", trial_idx, "- Added last point:", 
        parsed_data$last_x, ",", parsed_data$last_y, "\n")
  } else {
    cat("  Trial", trial_idx, "- No last point found\n")
  }
  
  # Sort by time
  if(nrow(point_data) > 0) {
    point_data <- point_data %>% arrange(time)
    cat("  Trial", trial_idx, "- Total points extracted:", nrow(point_data), "\n")
    return(point_data)
  } else {
    cat("  Trial", trial_idx, "- No points could be extracted\n")
    return(NULL)
  }
}

# Process all hand paths with verbose output
cat("\nProcessing hand paths:\n")
all_trajectories <- list()
successful <- 0

for(i in which(!is.na(my_data$Hand_Path))) {
  cat("\nProcessing trial", i, "(", my_data$Trial.Number[i], "):\n")
  points <- extract_hand_path_points(my_data$Hand_Path[i], i)
  
  if(!is.null(points) && nrow(points) >= 2) {  # Need at least 2 points for a path
    points$trial_num <- i
    points$Trial.Number <- my_data$Trial.Number[i]
    points$Target.Angle <- my_data$Target.Angle[i]
    points$Phase <- ifelse(my_data$Trial.Number[i] <= 19, 1, 2)
    
    # Check if Start_X and Start_Y exist
    if("Start_X" %in% names(my_data) && "Start_Y" %in% names(my_data)) {
      # Adjust coordinates relative to start position
      points$x_adj <- points$x - my_data$Start_X[i]
      points$y_adj <- my_data$Start_Y[i] - points$y
    } else {
      # Use raw values if start position is missing
      cat("  WARNING: Start_X or Start_Y missing. Using raw coordinates.\n")
      points$x_adj <- points$x
      points$y_adj <- points$y
    }
    
    all_trajectories[[length(all_trajectories) + 1]] <- points
    successful <- successful + 1
  }
}

cat("\nSuccessfully extracted trajectories for", successful, "out of", sum(!is.na(my_data$Hand_Path)), "trials\n")

# Combine all trajectories if we have any
if(length(all_trajectories) > 0) {
  trajectories_df <- do.call(rbind, all_trajectories)
  cat("Combined", nrow(trajectories_df), "trajectory points\n")
  
  # Create output directory
  output_dir <- "~/Documents/workspace/OnPoint-Music/Data/analysis_output"
  dir.create(output_dir, showWarnings = FALSE, recursive = TRUE)
  cat("Created output directory:", output_dir, "\n")
  
  # Check if directory was created successfully
  if(!dir.exists(output_dir)) {
    cat("ERROR: Failed to create output directory.\n")
    stop("Directory creation failed")
  }
  
  # Save the extracted data
  data_file <- file.path(output_dir, "trajectory_data.csv")
  write.csv(trajectories_df, data_file, row.names = FALSE)
  cat("Saved trajectory data to:", data_file, "\n")
  
  # Create basic trajectory plot
  cat("Creating trajectory plot...\n")
  trajectory_plot <- ggplot(trajectories_df, 
                            aes(x = x_adj, y = y_adj, group = trial_num, color = factor(Target.Angle))) +
    geom_path() +
    labs(title = "Extracted Hand Movement Trajectories",
         x = "X Position",
         y = "Y Position",
         color = "Target Angle") +
    geom_point(aes(x = 0, y = 0), color = "black", size = 4) +
    theme_minimal() +
    facet_wrap(~Phase)
  
  # Save the plot
  plot_file <- file.path(output_dir, "trajectories.png")
  ggsave(plot_file, trajectory_plot, width = 10, height = 8)
  cat("Saved trajectory plot to:", plot_file, "\n")
  
  # Calculate target positions
  target_data <- data.frame(
    Target.Angle = c(45, 135, 225, 315),
    angle_rad = c(45, 135, 225, 315) * pi / 180
  ) %>%
    mutate(
      target_x = cos(angle_rad) * 80,
      target_y = -sin(angle_rad) * 80
    )
  
  # Enhanced plot with targets and custom colors
  cat("Creating enhanced plot with targets...\n")
  enhanced_plot <- ggplot() +
    # Draw trajectories with a different color palette
    geom_path(data = trajectories_df, 
              aes(x = x_adj, y = y_adj, group = trial_num, color = factor(Target.Angle))) +
    # Draw targets
    geom_point(data = target_data,
               aes(x = target_x, y = target_y, fill = factor(Target.Angle)),
               shape = 21, size = 5, color = "black") +
    # Draw start point
    geom_point(aes(x = 0, y = 0), color = "black", size = 4) +
    # Use a nicer color scheme
    scale_color_brewer(palette = "Set1") +
    scale_fill_brewer(palette = "Pastel1") +
    # Add styling
    labs(title = "Movement Trajectories with Targets",
         x = "X Position",
         y = "Y Position",
         color = "Target Angle",
         fill = "Target Angle") +
    theme_minimal() +
    facet_wrap(~Phase)
  
  # Save the enhanced plot
  enhanced_file <- file.path(output_dir, "enhanced_trajectories.png")
  ggsave(enhanced_file, enhanced_plot, width = 10, height = 8)
  cat("Saved enhanced plot to:", enhanced_file, "\n")
  
  cat("\nAnalysis complete! Files saved to:", output_dir, "\n")
  cat("Check this directory for your output files.\n")
} else {
  cat("\nERROR: No trajectory data could be extracted.\n")
  cat("Creating fallback synthetic trajectories...\n")
  
  # Create synthetic data for demonstration
  synthetic_data <- data.frame()
  
  for(i in 1:nrow(my_data)) {
    trial <- my_data[i, ]
    angle_rad <- trial$Target.Angle * pi / 180
    phase <- ifelse(trial$Trial.Number <= 19, 1, 2)
    
    # Create points along path with some randomness
    for(t in seq(0, 1, length.out = 10)) {
      # Add some curve and jitter
      jitter_x <- runif(1, -5, 5) * t
      jitter_y <- runif(1, -5, 5) * t
      
      # Curve more in phase 2
      curve_factor <- if(phase == 1) 0.1 else 0.3
      curve_x <- sin(t * pi) * curve_factor * 20
      curve_y <- sin(t * pi) * curve_factor * 20
      
      point <- data.frame(
        trial_num = i,
        Trial.Number = trial$Trial.Number,
        Target.Angle = trial$Target.Angle,
        Phase = phase,
        t = t,
        x_adj = t * cos(angle_rad) * 80 + jitter_x + curve_x,
        y_adj = t * -sin(angle_rad) * 80 + jitter_y + curve_y,
        time = t * 1000
      )
      
      synthetic_data <- rbind(synthetic_data, point)
    }
  }
  
  # Create output directory
  output_dir <- "~/Documents/workspace/OnPoint-Music/Data/analysis_output"
  dir.create(output_dir, showWarnings = FALSE, recursive = TRUE)
  
  # Save synthetic data
  write.csv(synthetic_data, file.path(output_dir, "synthetic_trajectories.csv"), row.names = FALSE)
  
  # Plot synthetic trajectories
  synthetic_plot <- ggplot(synthetic_data, 
                           aes(x = x_adj, y = y_adj, group = trial_num, color = factor(Target.Angle))) +
    geom_path() +
    labs(title = "Synthetic Trajectories (for visualization only)",
         subtitle = "Note: These are not actual hand movements",
         x = "X Position",
         y = "Y Position",
         color = "Target Angle") +
    geom_point(aes(x = 0, y = 0), color = "black", size = 4) +
    theme_minimal() +
    facet_wrap(~Phase)
  
  # Save synthetic plot
  ggsave(file.path(output_dir, "synthetic_trajectories.png"), synthetic_plot, width = 10, height = 8)
  
  cat("Created synthetic trajectories as fallback.\n")
  cat("Files saved to:", output_dir, "\n")
}