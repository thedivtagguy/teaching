---
theme: css/reveal-theme.css
---
# Making Charts

Exploring visualization with Datawrapper and Rawgraphs

Session 6


---

![[IMG-20250331004955635.png]]

---

![[IMG-20250331005008190.png]]


---

![[IMG-20250331005258572.png]]

---

![[IMG-20250331005323029.png]]

---

![[IMG-20250331005506634.png]]

---

![[IMG-20250331005516360.png]]

---

## The Dataviz Recipe, Recapped

We've learnt a LOT during this week and opened up our minds to new processes. Let us recap this week a bit. 

---
## Step 1: Decide what you want to cook

As far as we are concerned, we're conducting small experiments in our kitchen.

Every experiment begins with a **question**.

<div class="fragment">

- "Are number of deaths correlated to water sources?"
- "Did the sanitation commission make things better at the hospital in Scutari?"

</div>
---

Or to take some more _local examples_

## What were your movie questions?

---

Once we have the question, we want to move on to

## Step 2: Find the sabzis


If our data is available to us, in form of a table or a CSV, we want to **check our vegetables!!**

In Orange, we did this through **Feature Statistics** to understand our data's structure.

<div class="fragment">

- Number of observations
- Number of columns
- Qualitative vs quantitative variables
- Range of values, shapes of distributions (histograms). 

</div>
---
### Step 3:  Wash, clean, peel, grate, fry

Having done that, we narrow the **scope of our inquiry** to a smaller subset of **variables** that are related. 

We break the question down to variables that will **help us figure out the answer**. This takes practice. 

We just _explore_ the data at this phase, examine it from this angle and that.

---
## Step 4: Sample & Taste

Take a look at your question again and then **rapidly** summarize, explore with quick charts, find interesting values. How do they look, feel? What helps you answer your question?


---

![[IMG-20250330223820600.png|300]]

---

### Step 5: Is this an idiot sandwich?

Having now tried to draw your visualization, is there a final AHA moment for you? Does it satisfy your curiosity? Answer your question? What does the person next to you say? 

If the answer is no to any of the above, try again. 

---

### Step 6: _Melody itni chocolatey kyun hai?_

Now that you have arrived at a visualization, how can you help it ACTUALLY answer the question? Are you making me guess your conclusion, or are you spelling it out for me? 

The best chart titles quickly tell viewers what they're looking at and why it matters, without making them work to understand the data's significance.

---

Just write better titles!

| Bad                             | Good                                                        |
| ------------------------------- | ----------------------------------------------------------- |
| Temperature Data                | Summer Temperatures Soar 5°C in ______ Since 2000           |
| Pie Chart of Pet Ownership      | Cats Overtake Dogs in Urban Apartments                      |
| Analysis of Student Performance | Sleep Matters: Students Who Rest 8+ Hours Score 23% Higher  |
| Transportation Methods          | Biking Cuts Commute Time in Half                            |
| Survey Results                  | Gen Z Abandoning Facebook While Boomer Usage Doubles        |
| Food Consumption                | Indians Eating 30% More Vegetables Than a Decade Ago        |
| Exercise Comparison             | Morning Workouts Burn More Calories Than Evening Sessions   |
| Movie Attendance                | Theaters Making Comeback as Streaming Subscriptions Decline |

---
## Litmus Testing Your Viz

Your visualisation is complete not when nothing more can be added, _but when nothing more can be taken away from it_.

<div class="fragment">

1. Capture the casual viewer's attention immediately - someone just glancing should be drawn in. Then keep them engaged long enough that they walk away feeling they truly understand the content and _can confidently explain it to others_.
2. It should also satisfy subject matter experts, leave as little room as possible for people to tell you "BUT ACKSHUALLY!!!"

</div>

---

## Parts of a Chart 


<split even gap='4'>

![[IMG-20250330223820635.png|500]]

1. Title
2. Subtitle
3. Axis (with units/labels)
4. Plot
5. Labels
6. Annotations

</split>
---

## Choosing a chart type

---

## Start with the function

Before you start with a chart type, start by defining the **purpose** of the visualization. This is guided by how you want to answer your question. 

---

### Function: Correlation

Show the relationship between two or more variables

<split even gap="2">

![[IMG-20250330224413152.png|400]]

![[IMG-20250330224430700.png|400]]

</split>


---

### Function: Ranking

The position of the values in an ordered list are of importance. 

<split even gap="4" style="margin-bottom:20px;">

![[IMG-20250330224908421.png|200]]

![[IMG-20250330224925978.png|200]]

</split>

<split even gap="4">

![[IMG-20250330224941817.png|200]]

![[IMG-20250330225029563.png|200]]

</split>

---


### Function: Distribution

Show values and how often they occur, reveal a "shape" of the data.

<split even gap="4">

![[IMG-20250330225317925.png|200]]

![[IMG-20250330225333632.png|200]]

![[IMG-20250330225400947.png|200]]

</split>


---

### Function: Change over time

Showing the change in a variable with over some time

<split even gap="2">

![[IMG-20250330233628183.png|300]]

![[IMG-20250330233643557.png|300]]
</split>

---

### Function: Magnitude

Show size comparison, usually counts. Useful in seeing bigger/smaller differences.

<split even gap="2" >

![[IMG-20250330233835841.png|200]]

![[IMG-20250330233850126.png|200]]

</split>

<split even gap="2" style="margin-top:20px;">

![[IMG-20250330233920834.png|200]]

![[IMG-20250330233936977.png|200]]

</split>

---

### Function: Part to Whole

Show how a single element can be broken down into things that make it up. 

<split even gap="2">

![[IMG-20250330234252503.png|200]]

![[IMG-20250330234310353.png|200]]

![[IMG-20250330234323153.png|200]]

</split>

---

### Useful References

- [Financial Times' Visual Vocabulary](https://raw.githubusercontent.com/Financial-Times/chart-doctor/main/visual-vocabulary/poster.png)
- [The Data Viz Project](https://datavizproject.com)
- [Data to Viz](https://data-to-viz.com)

---


<!--slide bg='./attachments/Day 6 - Charting Tools/IMG-20250330234427867.png' data-background-position="top"-->

---


<!--slide bg='./attachments/Day 6 - Charting Tools/IMG-20250330234813183.png' data-background-position="top"-->

---
## Data looks better naked

- Never trust the defaults
- Use your design brain
---
<iframe class="speakerdeck-iframe" style="border: 0px; background: rgba(0, 0, 0, 0.1) padding-box; margin: 0px; padding: 0px; border-radius: 6px; box-shadow: rgba(0, 0, 0, 0.2) 0px 5px 40px; width: 100%; height: auto; aspect-ratio: 560 / 420;" frameborder="0" src="https://speakerdeck.com/player/87bb9f00ec1e01308020727faa1f9e72" title="Remove to Improve (the data-ink ratio)" allowfullscreen="true" data-ratio="1.3333333333333333"></iframe>

---

### Let us try it ourselves

This is a real "visualization" from ESPN. Let us try to make it better with Datawrapper.

Download it by clicking [here](https://teaching.aman.bh/data/toughest-sports-by-skill.xlsx).

![[IMG-20250330233336603.png|600]]

---

### Step 1: Import your data

Head over to https://app.datawrapper.de/create/chart and upload this file.

![[IMG-20250330235220457.png|900]]

---

### Step 2: Verify

Check if everything is looking right. Blue for numbers, green for dates and black for text.

![[IMG-20250330235317390.png|900]]

---

### Step 3: Choose a Chart

Datawrapper will often try to select a chart on its own, which may be wrong: 

![[IMG-20250330235519957.png|900]]

Think of your function and choose a chart type. 


---

### Activity: Explore the Datawrapper UI

With this dataset uploaded, take a tour of the Datawrapper UI. There is a lot to see. Toggle Chart types, go to the `Refine` tab and play with some settings there to see how they change your chart. 

Time: 25 mins

---



![[IMG-20250331000301331.png|200]]

---

## Identify the functions of the following charts

---

![[IMG-20250331000519853.png]]

---

![[IMG-20250331000558841.png]]

---

![[IMG-20250331000645337.png]]

---

![[IMG-20250331000723387.png]]


---


![[IMG-20250331000759865.png|700]]


---

## Activity 2

Copy data from [here](https://gist.githubusercontent.com/thedivtagguy/3901fe2ba5a00bc5a05b5721cdde4e9d/raw/0867eaa20aefe2e455b70cf385233616ca4cad5e/time_use.csv). Explore it with Datawrapper or Rawgraphs.

Time: 45 mins

Example viz:

![[IMG-20250331004533216.png]]


---

## Recap: What are Data Summaries?

Data summaries are ways to make complex or large datasets easier to understand.

<div class="fragment">

Think of it as **minimizing data** to show a clearer picture.

</div>

---
## Why?

- Raw data is often too complex or large to visualize directly
- Our brains need structure to make sense of information
- Summaries help identify patterns that would be lost in the noise

---

## Summarization Methods

<split even gap="4">

Four approaches to summarization:

- **Aggregate**: Group similar data together
- **Project**: Reduce dimensions
- **Subsample**: Take a smaller portion
- **Filter**: Keep only what meets criteria

</split>

---
## Aggregate

Taking multiple data points and combining them

<div class="fragment">

Examples:

- Computing averages
- Binning into histograms
- Group summaries

</div>

---

## Filter

Selectively keeping data based on specific rules

<div class="fragment">

Examples:

- Only keeping sales data above ₹10,000
- Focusing on a specific time period
- Removing outliers

</div>

---

## From Summary to Visualization

Once you've summarized your data, you need to consider:

<div class="fragment">

1. **What's your function?** (Showing correlation? Ranking? Distribution?)
2. **Who's your audience?** (Experts? General public? Decision-makers?)
3. **What's the story?** (What insights should leap out?)

</div>

---

## Visualizing Summaries


![[IMG-20250331010031795.png]]

<cite>

Sarikaya, A., M. Gleicher, and D. A. Szafir. ‘Design Factors for Summary Visualization in Visual Analytics’. _Computer Graphics Forum_ 37, no. 3 (June 2018): 145–56. [https://doi.org/10.1111/cgf.13408](https://doi.org/10.1111/cgf.13408).

</cite>

---

## Let's See This in Action

For the next activity, let's trace the steps:

1. **Choose your question** (What are we curious about?)
2. **Examine your data** (What variables do we have?)
3. **Apply summarization** (Aggregate, project, subsample, or filter)
4. **Select visualization type** (Based on function)
5. **Refine and iterate** (Is it answering our question?)


---

## Activity: Visualizing a Summary

- Download the dataset here: https://github.com/rfordatascience/tidytuesday/blob/main/data/2023/2023-01-17/artists.csv
![[IMG-20250331011841610.png]]

- Import it into Orange, calculate a summary
- Export the summarized dataset from Orange as a CSV
- Visualize it in Datawrapper

---


![[IMG-20250331012241673.png]]


---

Here's what I made: 

![[IMG-20250331012942541.png|500]]

---

### PSTTT!!!: Try converting your summary's shape

Your summary might come in the LONG format (https://teaching.aman.bh/cdv2025/day-3#data-reshaping-cheatsheet) but for visualizing multiple things individually on Datawrapper, you usually need a WIDE table. 

I've made this for you to do this conversions easily:

https://pivotteer.netlify.app/

