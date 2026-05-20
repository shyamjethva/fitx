import { Request, Response } from 'express';

// Fallback collections for the dynamic programmatic plan generator
const workoutExercises: Record<string, string[]> = {
  push: [
    "Incline Dumbbell Press: 4 sets x 8-10 reps (RPE 9)",
    "Flat Barbell Bench Press: 3 sets x 8 reps (Focus on progressive overload)",
    "Overhead Barbell Military Press: 3 sets x 8-10 reps",
    "Lateral Cable Raises: 4 sets x 12-15 reps (Double drop set on final set)",
    "Incline Dumbbell Flyes: 3 sets x 12 reps",
    "Overhead Rope Tricep Extensions: 4 sets x 12 reps",
    "Dips (Weighted if possible): 3 sets x max reps"
  ],
  pull: [
    "Weighted Pullups: 4 sets x 6 reps (RPE 8.5)",
    "Barbell Bent-Over Rows: 3 sets x 8 reps (Underhand grip)",
    "Seated Cable Row (Neutral grip): 3 sets x 10 reps (Focus on scapular squeeze)",
    "Incline Dumbbell Hammer Curls: 4 sets x 12 reps",
    "Rear Delt Reverse Flyes: 4 sets x 15 reps",
    "Barbell Preacher Curls: 3 sets x 10 reps",
    "Hyperextensions: 3 sets x 15 reps"
  ],
  legs: [
    "Barbell Back Squats: 4 sets x 6-8 reps (RPE 9)",
    "Romanian Deadlifts: 3 sets x 8 reps (Focus on hamstring stretch)",
    "Leg Press (Plate-loaded): 3 sets x 12 reps (High & wide foot placement)",
    "Seated Hamstring Curls: 4 sets x 12-15 reps",
    "Leg Extensions: 3 sets x 15 reps (Hold contraction for 1 sec)",
    "Standing Calf Raises: 4 sets x 15 reps"
  ],
  upper: [
    "Flat Dumbbell Press: 4 sets x 8 reps",
    "Lat Pulldowns (Wide grip): 4 sets x 10 reps",
    "Seated Dumbbell Shoulder Press: 3 sets x 10 reps",
    "Chest Supported T-Bar Rows: 3 sets x 10 reps",
    "Cable Crossover Flyes: 3 sets x 12 reps",
    "Dumbbell Bicep Curls: 3 sets x 12 reps",
    "Tricep Pushdowns: 3 sets x 12 reps"
  ],
  lower: [
    "Barbell Front Squats: 4 sets x 8 reps",
    "Lying Leg Curls: 4 sets x 10 reps",
    "Bulgarian Split Squats: 3 sets x 10 reps per leg",
    "Seated Calf Raises: 4 sets x 12 reps",
    "Cable Pull-Throughs: 3 sets x 12 reps",
    "Hanging Leg Raises: 4 sets x max reps"
  ],
  fullbody: [
    "Deadlifts (Conventional or Sumo): 4 sets x 5 reps",
    "Incline Barbell Press: 4 sets x 8 reps",
    "Pull-ups / Chin-ups: 3 sets x max reps",
    "Dumbbell Lunges: 3 sets x 12 reps per leg",
    "Dumbbell Lateral Raises: 4 sets x 12 reps",
    "Plank Hold: 3 sets x 60 seconds"
  ]
};

const dietMeals: Record<string, { meal1: string; meal2: string; meal3: string; meal4: string; meal5: string; totalCal: number; macros: string }> = {
  bulk: {
    meal1: "4 Whole Eggs, 80g Rolled Oats cooked in Whole Milk, 20g Almonds, 1 Scoop Whey",
    meal2: "220g Grilled Chicken Breast, 180g Basmati Rice, Steamed Broccoli with Olive Oil",
    meal3: "1 Banana, 2 Slices Whole Wheat Toast, 30g Natural Peanut Butter",
    meal4: "200g Grilled Salmon or Lean Beef, 250g Baked Sweet Potatoes, Asparagus",
    meal5: "200g Low Fat Paneer or Greek Yogurt, 15g Cashews",
    totalCal: 3100,
    macros: "40% Carbs, 35% Protein, 25% Fat"
  },
  shred: {
    meal1: "5 Egg Whites + 1 Whole Egg, 40g Oats cooked in water, Blueberries",
    meal2: "200g Baked Cod or Chicken Breast, 100g Brown Rice, Steamed Spinach",
    meal3: "1 Apple, 1 Scoop Whey Protein isolate in water",
    meal4: "220g Grilled White Fish, 150g Roasted Sweet Potato, Mixed Green Salad",
    meal5: "150g Low Fat Cottage Cheese or Casein Shake, 10g Peanut Butter",
    totalCal: 1850,
    macros: "30% Carbs, 50% Protein, 20% Fat"
  },
  vegan: {
    meal1: "Tofu Scramble (150g Tofu) with Spinach & Tomatoes, 1 Slice Sourdough, Avocado",
    meal2: "Lentil & Chickpea Curry (200g), 120g Quinoa, Steamed Cauliflower",
    meal3: "Vegan Protein Shake, 1 Scoop Soy/Pea Protein, 30g Oats, Almond Milk",
    meal4: "Tempeh Stir-fry (180g Tempeh) with Broccoli, Bell Peppers, 100g Brown Rice",
    meal5: "Chia Seed Pudding (30g Chia seeds in Coconut Milk), 15g Walnuts",
    totalCal: 2200,
    macros: "45% Carbs, 30% Protein, 25% Fat"
  },
  carbcycle: {
    meal1: "3 Egg Whites + 2 Whole Eggs, 50g Oats, 10g Chia Seeds",
    meal2: "200g Turkey Breast, 150g Jasmine Rice (High Carb Days) or Asparagus (Low Carb Days)",
    meal3: "1 Rice Cake with 15g Almond Butter, 1 Scoop Whey",
    meal4: "200g Lean Beef Flank, 200g Sweet Potato (High Carb) or Avocado Salad (Low Carb)",
    meal5: "180g Low Fat Paneer or Micellar Casein Shake",
    totalCal: 2350,
    macros: "Carb Cycling Matrix (High/Low variation)"
  }
};

export const generateAIPlan = async (req: Request, res: Response) => {
  try {
    const { memberName, goal, activityLevel, workoutSplit, dietType, apiKey } = req.body;

    const athleteName = memberName || 'Athlete';
    const planGoal = goal || 'Overall Fitness & Recomposition';
    const splitKey = (workoutSplit || '').toLowerCase();
    const dietKey = (dietType || '').toLowerCase();

    // Determine target API Key (prioritizing custom user key, then backend env key)
    const activeApiKey = apiKey || process.env.GEMINI_API_KEY;

    if (activeApiKey) {
      try {
        const prompt = `You are an elite level certified Personal Trainer and Sports Nutritionist at FitX.
Generate a completely personalized, premium fitness blueprint.
ATHLETE SPECIFICS:
- Name: ${athleteName}
- Goal: ${planGoal}
- Activity Level: ${activityLevel}
- Workout Split Preference: ${workoutSplit}
- Nutritional Diet Preference: ${dietType}

Provide the response in two distinct JSON fields inside a single JSON object:
{
  "diet": "A detailed daily meal schedule with 5 specific meals (including exact timing, ingredients, portion sizes, calories, and macros). Add a clear summary of total calories and macro percentages at the end. Use '■' for meals.",
  "workout": "A comprehensive daily workout routine based on the split preference. For each day in the split, include exact exercises, sets, reps, rest times, and directives. Include warm-up and cool-down protocols. Use '■' for sections and '-' for exercises."
}
Only output the valid JSON object. Do not include markdown formatting like \`\`\`json or \`\`\`. Just output raw JSON.`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${activeApiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" }
          })
        });

        if (response.ok) {
          const apiData = await response.json();
          const responseText = apiData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (responseText) {
            const parsed = JSON.parse(responseText.trim());
            if (parsed.diet && parsed.workout) {
              return res.json(parsed);
            }
          }
        }
        console.warn("Gemini call completed but response could not be parsed. Falling back to dynamic programmatic generator.");
      } catch (geminiErr) {
        console.error("Gemini invocation failed:", geminiErr);
      }
    }

    // --- FALLBACK DYNAMIC PROGRAMMATIC PLAN GENERATOR ---
    // Compile dynamic diet plan
    let chosenDiet = dietMeals.bulk;
    if (dietKey.includes('shred') || dietKey.includes('trim') || dietKey.includes('keto')) {
      chosenDiet = dietMeals.shred;
    } else if (dietKey.includes('vegan') || dietKey.includes('plant')) {
      chosenDiet = dietMeals.vegan;
    } else if (dietKey.includes('cycle') || dietKey.includes('mediterranean')) {
      chosenDiet = dietMeals.carbcycle;
    }

    const dietText = `■ MEAL 1 (08:00 AM - Breakfast):\n  - ${chosenDiet.meal1}\n\n■ MEAL 2 (01:00 PM - Lunch):\n  - ${chosenDiet.meal2}\n\n■ MEAL 3 (04:30 PM - Pre-Workout):\n  - ${chosenDiet.meal3}\n\n■ MEAL 4 (08:00 PM - Post-Workout):\n  - ${chosenDiet.meal4}\n\n■ MEAL 5 (10:00 PM - Bedtime Recovery):\n  - ${chosenDiet.meal5}\n\n📊 CALORIE BENCHMARK: ${chosenDiet.totalCal} kcal | Target Macros: ${chosenDiet.macros}.\nDynamically compiled under ${dietType.toUpperCase()} directives for ${athleteName.toUpperCase()}.`;

    // Compile dynamic workout plan based on split preference
    let workoutText = "";
    if (splitKey.includes('ppl') || splitKey.includes('push')) {
      workoutText = `■ DAY 1: PUSH POWER & HYPERTROPHY\n${workoutExercises.push.map(ex => `  - ${ex}`).join('\n')}\n\n■ DAY 2: PULL POWER & WIDTH\n${workoutExercises.pull.map(ex => `  - ${ex}`).join('\n')}\n\n■ DAY 3: LOWER BODY STRENGTH & MASTERY\n${workoutExercises.legs.map(ex => `  - ${ex}`).join('\n')}\n\n🎯 DIRECTIVES: Target RPE 8.5-9 on primary compound lifts. Rest 90-120 seconds between sets. Keep progressive logs.`;
    } else if (splitKey.includes('upper') || splitKey.includes('lower')) {
      workoutText = `■ DAY 1: UPPER BODY INTENSITY SPLIT\n${workoutExercises.upper.map(ex => `  - ${ex}`).join('\n')}\n\n■ DAY 2: LOWER BODY INTEGRATION SPLIT\n${workoutExercises.lower.map(ex => `  - ${ex}`).join('\n')}\n\n■ DAY 3: ACTIVE MOBILITY & CORE PROTOCOL\n  - Plank Holds: 4 sets x 60 secs\n  - Russian Twists: 3 sets x 20 reps\n  - Hanging Leg Raises: 4 sets x max reps\n  - Hip Flexor & Hamstring Stretch: 15 mins\n\n🎯 DIRECTIVES: Focus on eccentric control (3-sec negatives). Rest 60-90 seconds. Compiled dynamically for ${athleteName.toUpperCase()}.`;
    } else {
      // Default / Full Body split
      workoutText = `■ DAY 1: FULL BODY METABOLIC STACK\n${workoutExercises.fullbody.map(ex => `  - ${ex}`).join('\n')}\n\n■ DAY 2: STEADY STATE CARDIO & CORE STRETCH\n  - Incline LISS Treadmill Walk: 40 mins (HR 120-130 bpm)\n  - Bicycle Crunches: 3 sets x 25 reps\n  - Bird-Dogs: 3 sets x 12 reps\n\n■ DAY 3: FULL BODY FUNCTIONAL INTEGRATION\n  - Kettlebell Swings: 4 sets x 15 reps\n  - Pushups (Staggered): 3 sets x max reps\n  - Goblet Squats: 4 sets x 10 reps\n  - Face Pulls: 4 sets x 15 reps\n\n🎯 DIRECTIVES: Focus on metabolic efficiency and high cardiorespiratory response. Compiled for level: ${activityLevel.toUpperCase()}.`;
    }

    res.json({
      diet: dietText,
      workout: workoutText
    });
  } catch (error: any) {
    console.error("AI Plan Generator error:", error);
    res.status(500).json({ error: error.message || 'Failed to generate plan' });
  }
};
