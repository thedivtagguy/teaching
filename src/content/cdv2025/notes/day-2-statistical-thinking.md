---
theme: css/reveal-theme.css
controls: "false"
transition: fade
---
## Getting started with visual & statistical thinking

Or, a modest inquiry into why the mind prefers pictures to p

**Session 2**

---

## Welcome back! 

Let us start by discussing some things from yesterday's activity. 

- How many of you recorded data digitally vs on paper? What were your challenges? <!--element class="fragment"-->
- While recording data, what was annoying? What did you have to deal with while collating the Google sheet? <!--element class="fragment"-->

<div class="fragment">

Data collection is a _hard_ activity. Put yourselves in the shoes of John Snow roaming the streets of Soho or Nightingale counting the dead at Scutari.

</div>

---

The data we get to work with are rarely, if ever, in the format we need to do our analyses. It’s often the case that one tool requires data in one format, while another tool requires the data to be in another format. 

<br/>
To be efficient data-goblins, we should have good tools for _reshaping_ data for our needs so we can do our actual work like making plots.

We'll come back to our datasets, hang on to them for a bit.  <!--element class="fragment"-->

---

## A note about the submissions

Yesterday, around 50% of the submissions were clearly ChatGPT generated. I've let you know my rules very clearly:


![[IMG-20250402222525155.png]]
----

**I am extremely proud of the people who put time in!** 

Those that didn't, and I'm sure you know who you are, I'll be glad to come round to your submissions when it is written by **you**.

I hope we can spend the rest of our 9 days together learning and not worrying about the origins of your work.

---

> **"There is a magic in graphs."** <br/>
> "The proﬁle of a curve **reveals** in a ﬂash a whole situation — the life history of an epidemic, a panic, or an era of prosperity. The curve **informs** the mind, awakens the imagination, **convinces**."

~ *Henry D. Hubbard, National Bureau of Standards*

note: - Data Viz includes _shapes_ that carry strong cultural memories; and impressions for us. These cultural memories help us to use data viz in a _universal way_ to appeal to a wide variety of audiences. (Do humans have a gene for geometry?[1](https://av-quarto.netlify.app/content/courses/nocode/modules/01-natureofdata/#fn1)); 

---

What does this graph tell you? 

Hint: The legend shows the **number of measles cases** in each state for that month.


![[IMG-20250402222525191.png]]

<cite>

https://graphics.wsj.com/infectious-diseases-and-vaccines/

</cite>

---
<split even gap="2">

<div>

Not all is nice and dandy in the dataviz world. It is important to be able to differentiate the good and the bad. 

Sometimes, we're in this situation:

</div>

![[IMG-20250402222525232.png|400]]

</split>


> ... the Emperor walked through the streets of his capital; and all the people standing by cried out, “Oh! How beautiful are our Emperor's new clothes! What a lovely coat and how gracefully the scarf hangs!”, no one would admit they could not see these much-admired clothes; because, in doing so, they would have declared themselves either an idiot or unfit for his office...

---

## 🕵🏻 Data Literacy Tidbits #1

While our minds are still fresh, lets take a few minutes to quiz ourselves on _why_ a piece of dataviz might...not pass the sniff test.

---


![[IMG-20250402222525272.png|600]]

<br/>
Notice the "reddest" states, what do you think is wrong here? 

<!--element class="fragment"--> 

---

![[IMG-20250402222525299.png|600]]

---

![[IMG-20250402222525317.png]]

<cite>

Page 228, Accidental Deaths and Suicides in India 2022 https://data.opencity.in/dataset/accidental-deaths-and-suicides-in-india-2022

</cite>

---

“I doubled my performance” (You were only able to do one pushup before.)

"90% of the university prefers grapes on pizza" (You interviewed 5 people)

---

## 🕵🏻 Data Literacy Tidbits #2

![[IMG-20250402222525338.png|400]]

<br/>
"Gen Alpha isn't spending anything on alchocol, they're killing the industry!!" <!--element class="fragment"-->


---

A data visualization is useful only if it encodes information in a way that our eyes can perceive and our brain can understand.

When creating data visualizations, we're essentially translating abstract data into visual forms that our perceptual system can process effectively. 

---

This translation happens through two fundamental components:

**Marks** are the basic geometric elements that represent our data objects or their relationships.

**Channels** are the visual properties we assign to these marks to encode data values. They control how the marks appear visually and carry meaning.


A successful visualization uses appropriate combinations that make patterns and relationships immediately apparent to viewers without requiring excessive cognitive effort.

---

## The eyes have it

When we look at a line chart, or notice a number in a dashboard, we use our working memory to store just the information we need at the moment. This type of memory breaks the entire visual into small chunks of information, in a process appropriately called ‘chunking.’ Surprisingly, for all the complexity of our brain, our working memory can hold only about 3 chunks of information at any given time. 


note: Let’s say we walk into a supermarket to buy oranges. Our eyes first scan the layout of the supermarket.
At the same time, our brain processes the various sections of the layout, and instructs the eyes to zone
in on the fruits section. It does this by sending signals about how fruits look from memory. The eyes then
break the entire scanned area into parts, and scans each part to spot the fruits section. The same process
is repeated till we zero in on the oranges in the fruits section. This process of visualizing information is
performed by the eyes and memory working in parallel.

---

## Pre-attentive attributes

These attributes are what immediately catch our eye when we look at a visualization. They can be perceived in less than 10 milliseconds, even before we make a conscious effort to notice them.

---



![[IMG-20250402222525353.png]] <!--element class="fragment fade-in-then-out"-->

<div class="fragment fade-in-then-out"/>

![[IMG-20250402222525378.png]]
<!--element class="fragment fade-in-then-out"-->

note: Line, width, orientation, curvature

---

![[IMG-20250402222525395.png]]
<!--element class="fragment fade-in-then-out"-->
<div class="fragment fade-in-then-out"/>

![[IMG-20250402222525410.png]]
<!--element class="fragment fade-in-then-out"-->

---

![[IMG-20250402222525431.png]]
<!--element class="fragment fade-in-then-out"-->
<div class="fragment fade-in-then-out"/>


![[IMG-20250402222525448.png]]
<!--element class="fragment fade-in-then-out"-->


---

### Where is the red dot? 

![[IMG-20250402222525470.png|600]]

---

![[IMG-20250402222525492.png|600]]

---

![[IMG-20250402222525509.png|600]]


---
When looking at a plot, can you accurately detect differences is the sizes of the bubbles? Can you discriminate between all of the colors, compare the shades? Can you separate the dimensions of the data?

<br/>

These are important for the **effectiveness** and the **expressiveness** of your visualization.

![[IMG-20250402222525525.png]]

---
 ### Position

![[IMG-20250402222525542.png|900]]

---
 ### Length
![[IMG-20250402222525563.png]]

---
### Angle
![[IMG-20250402222525583.png]]

---

### Direction 

![[IMG-20250402222525597.png]]

---

### Shape
![[IMG-20250402222525613.png|400]]

---

### Area & Volume

![[IMG-20250402222525629.png|500]]

---
### Color

![[IMG-20250402222525645.png]]

Color should almost always be the last thing to encode your data. Remember the fiasco yesterday with Nightingale's plot? 

---

## To repeat: 

**Marks** are **geometries**, shapes which we use to represent our data. 

**Channels** are the properties that **drive how those geometries look**. 


---
## Dear Data

<iframe width="560" height="315" src="https://www.youtube.com/embed/NX43rzXQaik?si=GVGKEdFr-8K0bJnW" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
---

![[IMG-20250402222525678.png]]

---

![[IMG-20250402222525741.png]]

---

![[IMG-20250402222525791.png]]

![[IMG-20250402222525841.png]]

---
## Activity 2: Dear Data

From your survey responses from yesterday, everyone choose some questions and their answers that they want to visualize. 

- Your visualizations should go on one side of the sheet, and a legend on the other. 
- Remember that your visualization + legend **need to stand on their own!** Giorgia and Stefanie couldn't go there to explain stuff to each other. 
- Try to incorporate as much fun detail and nuance from your surveys. Is there something fun that came up while you interviewed people? Try to include that too. 

**For reference**: 
- https://www.instagram.com/deardatapostbox
- https://www.dear-data.com/theproject

**Time**: 45 mins (10+25+10)

---
### Data, data, data! I cannot make bricks without clay

---

<split even gap="2">
<div>

### The Case of the Five Orange Pips

Three Openshaw family members received envelopes with orange seeds
- Each envelope postmarked from different cities worldwide
- Each recipient died mysteriously after receiving the envelope
- Pattern: Time between letter and death shortened (7 weeks → 3 days → 1 day)

</div>


<div >

![[IMG-20250402222525888.png|300]]

</div>

</split>


---

> "I searched the Dundee records, and when I found that the Lone Star was there in January, '85, my suspicion became a certainty. I then inquired as to the vessels which lay at present in the port of London. [...] The Lone Star had arrived here last week. I went down to the Albert Dock and found that she had been taken down the river by the early tide this morning, homeward bound to Savannah." <br/>
> ~ Holmes

---

![[IMG-20250402222525903.png]]


---


Data is produced through **systematic observation, measurement, and recording of specific phenomena**

But far more importantly, it is understood through human interpretation.

note: In Holmes' case, the meaning emerged not from raw data, but his skills of identifying related pieces of information and an interpretation of patterns


---

How we'll be cooking. <i class="fa-solid fa-down-long"></i>
<iframe width="800px" height="600px" src="https://teaching.aman.bh/iframes/recipe"/>


---

## Spreadsh(ee)its

The most _common_ form of data that we'll be looking at in this class is **tabular** data. This comes in tables. This is a table: 

| Date       | Boeing Stock Price | Amazon Stock Price | Google Stock Price |
| :--------- | :----------------- | :----------------- | :----------------- |
| 2009-01-01 | $173.55            | $174.90            | $174.34            |
| 2009-01-02 | $172.61            | $171.42            | $170.04            |

![[IMG-20250402222525919.png]] <!--element class="fragment"-->

---

The most common format we'll be working with is `CSVs`. 

<br/>

CSVs can be opened by even your Notepad on windows whereas Excel files always need Excel. In CSVs, data is separated by commas. This is a CSV of the previous data: 

<iframe src="https://carbon.now.sh/embed?bg=rgba%28171%2C184%2C195%2C0%29&t=seti&wt=none&l=auto&width=680&ds=false&dsyoff=20px&dsblur=39px&wc=true&wa=true&pv=39px&ph=48px&ln=false&fl=1&fm=Hack&fs=14px&lh=133%25&si=false&es=2x&wm=false&code=Date%252CBoeing%2520Stock%2520Price%252CAmazon%2520Stock%2520Price%252CGoogle%2520Stock%2520Price%250A2009-01-01%252C%2524173.55%252C%2524174.90%252C%2524174.34%250A2009-01-02%252C%2524172.61%252C%2524171.42%252C%2524170.04" style="width: 648px; height: 208px; border:0; transform: scale(1); overflow:hidden;" sandbox="allow-scripts allow-same-origin"> </iframe>


---

## Types of ~Sabzis~ Data

```mermaid
graph TD
    Data[Data] --> Quantitative[Quantitative Data]
    Data --> Qualitative[Qualitative Data]
    
    Quantitative --> Discrete[Discrete Data<br>Countable, whole numbers<br>e.g., number of emails]
    Quantitative --> Continuous[Continuous Data<br>Measurable, can take any value<br>e.g., temperature, time]
    
    Qualitative --> Nominal[Nominal Data<br>Categories without order<br>e.g., colors, gender]
    Qualitative --> Ordinal[Ordinal Data<br>Categories with order<br>e.g., satisfaction ratings]
    
    Discrete --> Count[Count Data<br>Non-negative integers<br>e.g., visitors per day]
    Discrete --> Binary[Binary Data<br>Yes/No, 0/1<br>e.g., clicked or not]
    
    Continuous --> Interval[Interval Data<br>Equal distances, no true zero<br>e.g., temperature in °C]
    Continuous --> Ratio[Ratio Data<br>Equal distances, true zero<br>e.g., height, weight]
    
    classDef blue fill:#a8d5ff,stroke:#333,stroke-width:1px
    classDef green fill:#c2e5a0,stroke:#333,stroke-width:1px
    classDef yellow fill:#fff8a8,stroke:#333,stroke-width:1px
    classDef orange fill:#ffcfa3,stroke:#333,stroke-width:1px
    
    class Data blue
    class Quantitative,Qualitative green
    class Discrete,Continuous,Nominal,Ordinal yellow
    class Count,Binary,Interval,Ratio orange
    
```

---

## Discrete and Continuous

If you have quantitative data, then the data can be either continuous or discrete. 

**Discrete data have finite values**, or buckets. You can count them. 

Continuous data _could_ have an infinite number of values, which forms 'a continuum'.

If you find yourself saying "number of...", thats a discrete value. Here are some examples of discrete and continuous data.

| Discrete                                                                                                                     | Continuous                                                                                                     |
| ---------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| 1. Number of children in a household<br>2. Number of languages a person speaks<br>3. Number of people sleeping in this class | 1. Heights and weights  <br>2. Decreasing charge on your laptop when you forgot the charger<br>3. Temperatures |

---

<div class="grid grid-cols-2 gap-4 data-types-grid"> <div> <h3>Nominal</h3> <p>Just categories or names</p> <ul> <li>Like car brands or blood types</li> <li>You can count them but not rank them</li> </ul> </div> <div class="fragment fade-in-then-semi-out" data-fragment-index="2"> <h3>Ordinal</h3> <p>Categories with an order</p> <ul> <li>Like rankings (1st, 2nd, 3rd place) or satisfaction levels (unhappy, neutral, happy)</li> <li>The order matters, but the gaps between them might not be equal</li> </ul> </div> <div class="fragment fade-in-then-semi-out" data-fragment-index="3"> <h3>Interval</h3> <p>Equal steps, but zero is made up</p> <ul> <li>Like temperature in °F (0°F isn't "no temperature")</li> <li>Equal distances between numbers</li> </ul> </div> <div class="fragment fade-in-then-semi-out" data-fragment-index="4"> <h3>Ratio</h3> <p>Equal steps with true zero</p> <ul> <li>Like weight or time (0 seconds means no time)</li> <li>You can say "twice as much" meaningfully</li> </ul> </div> </div>

---

Identify each type of variable in this table

<div class="table-wrapper very-compact-table">


| Customer_ID | Visit_Date | Store_Location | Visit_Count | Order_Count | Membership_Status | Purchase_Amount | Time_Spent | Temperature_C | Beverage_Type | Food_Ordered | Satisfaction_Rating | Age | Height_cm | Weight_kg | Gender | Favorite_Color |
| ----------- | ---------- | -------------- | ----------- | ----------- | ----------------- | --------------- | ---------- | ------------- | ------------- | ------------ | ------------------- | --- | --------- | --------- | ------ | -------------- |
| 1           | 2025-03-01 | Downtown       | 5           | 12          | Yes               | 8.75            | 24         | 22.5          | Latte         | Yes          | 4                   | 29  | 175.3     | 68.2      | Male   | Blue           |
| 2           | 2025-03-01 | Suburb         | 3           | 5           | No                | 12.50           | 45         | 22.7          | Cappuccino    | Yes          | 5                   | 35  | 162.8     | 55.1      | Female | Red            |
| 3           | 2025-03-02 | Downtown       | 1           | 1           | No                | 4.25            | 15         | 23.1          | Americano     | No           | 3                   | 42  | 180.5     | 78.4      | Male   | Green          |
| 4           | 2025-03-02 | Mall           | 8           | 20          | Yes               | 15.75           | 35         | 21.8          | Frappuccino   | Yes          | 2                   | 19  | 160.0     | 52.3      | Female | Purple         |
| 5           | 2025-03-03 | Downtown       | 2           | 4           | No                | 6.50            | 30         | 22.3          | Espresso      | No           | 4                   | 51  | 168.7     | 70.2      | Male   | Black          |
| 6           | 2025-03-03 | Suburb         | 15          | 42          | Yes               | 9.25            | 55         | 22.9          | Mocha         | Yes          | 5                   | 27  | 155.2     | 48.9      | Female | Pink           |
| 7           | 2025-03-04 | Mall           | 4           | 8           | No                | 11.00           | 20         | 23.2          | Tea           | No           | 3                   | 65  | 172.4     | 65.8      | Male   | Brown          |
| 8           | 2025-03-04 | Downtown       | 7           | 15          | Yes               | 14.25           | 40         | 22.5          | Latte         | Yes          | 4                   | 31  | 165.9     | 58.3      | Female | Yellow         |
| 9           | 2025-03-05 | Suburb         | 2           | 3           | No                | 5.75            | 25         | 21.5          | Americano     | No           | 2                   | 47  | 178.2     | 75.6      | Male   | White          |
| 10          | 2025-03-05 | Mall           | 10          | 25          | Yes               | 18.50           | 60         | 22.0          | Cappuccino    | Yes          | 5                   | 22  | 159.3     | 51.7      | Female | Orange         |

</div>

---


> All happy families are alike; each unhappy family is unhappy in its own way.
> <br/>
> ~ Leo Tolstoy, _Anna Karenina_

---

But first, some Brad Pitt

<iframe width="560" height="315" src="https://www.youtube.com/embed/PlKDQqKh03Y?si=7wYTlkwglH9PVLFx" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

---
- **Target Average:** .477 (Giambi's OBP)
- **Strategy:** Find three players whose OBPs add up to 3 * .477 = 1.431. Then, when you divide that sum by 3, you get the target average.

The key is that he's using the concept of the average to _plan_ and _predict_ the collective outcome of a group of players.

<div class="fragment">

The _Moneyball_ example focuses on **achieving a target average by combining multiple values**. 
</div>

<div class="fragment">

 Everyday examples often focus on **finding a representative value for a set of existing data**.
 </div>


---
<div class="grid grid-cols-3 gap-4"> <div class="fragment fade-in-then-semi-out" data-fragment-index="1"> 

### Mean
The **arithmetic average** 

- Sum of all values divided by the number of values 
- Most commonly used measure 
- Significantly influenced by outliers 
- Example: In {3,5,6,7,7,9,8,7,5,6,4,5,3,1}, the mean is 5.43 

</div> <div class="fragment fade-in-then-semi-out" data-fragment-index="2"> 

### Median
The **middle value** 
- Data must be arranged in order 
- Particularly useful for skewed distributions 
- Stable with unusually large/small values 
- Example: In {1,3,3,4,5,5,5,6,6,7,7,7,8,9}, the median is 5.5 
</div> <div class="fragment fade-in-then-semi-out" data-fragment-index="3"> 
### Mode
The **most frequent value** 
- Shows what value occurs most often 
- Can have multiple modes (bimodal, multimodal) 
- Doesn't necessarily represent the center 
- Example: In {3,5,6,7,7,9,8,7,5,6,4,5,3,1}, the mode is 7 

</div> </div> 
---

<iframe src="https://teaching.aman.bh/iframes/central-tendency" height="600px" width="900px"/>

---
## Let us look at some practical examples

Please open **Orange**.

---

The interface is very simple:

![[IMG-20250402222525935.png]]
<br/>

1. Main drawing pane
2. Data import functions
3. Transform functions

---

Drag the 'Datasets' widget into the drawing window. 

![[IMG-20250402222525950.png]]

---
Select `Adult Census Income`.

![[IMG-20250402222525966.png]]


---

Connect it to the `FEATURE STATISTICS` widget (from the Transform pane). What are the variables here?

![[IMG-20250402222525980.png]]

note:- Dataset length: How many rows/observations?
- Dataset breadth: How many columns/variables?
- How many Quant variables?
- How many Qual variables?
- Quant variables: min, max, mean, median, sd
- Qual variables: levels, counts per level
- Both: means, medians for each level of a Qual variable…
---

![[IMG-20250402222526000.png]]

---

## What is the mean age WITHIN an occupation?

Introducing `GROUP BY`! Whenever you feel like you need to get the measure of a `Quantitative` variable **across** another `Qualitative` variable, you will use `GROUP BY`.

---

In the transform pane, fine 'GROUP' and add it to your drawing pane. 

![[IMG-20250402222526019.png]]

Connect it to your input data 

---

Orange has this annoying habit of selecting EVERYTHING when you first open the `GROUP` widget. **Unselect all aggregations**. 

![[IMG-20250402222526037.png|600]]


---


![[IMG-20250402222526054.png]]

WHAT!? We went from 48,800 rows of data to 14! <!--element class="fragment"-->

TIP: Use `CMD` or the `Windows` key to select two or more `GROUP BY` variables <!--element class="fragment"-->

---

![[IMG-20250402222526069.png]]

---

Time to meet our first chart...

### The Bar Chart 

<split even gap="2">

![[IMG-20250402222526084.png|300]]

<div>

|What It Is|Description|
|---|---|
|**Basic Idea**|Shows numbers as bars. Longer bars = bigger numbers|
|**Parts**|•Has a category<br>• Each bar shows one number|
|**What You Can Do**|• Compare sizes easily<br>• Find exact values<br>• Quickly see which is biggest/smallest|

</div>
</split>
---

![[IMG-20250402222526100.png]]

---

![[IMG-20250402222526117.png]]

---

Now calculate the mean **by occupation and sex**. Then connect to the `DATA TABLE` widget to see the data _after all these steps_. 

![[IMG-20250402222526134.png|400]]

The `DATA TABLE` can be used at any time to figure out what your data looks at that point. Can you now plot the bar graph again and **colour by** sex?

---

## Your turn!

**Question:** Who works the longest hours on an average? 


![[IMG-20250402222526154.png|500]]

---

Our second weapon for **quantitative data**: 
## The Histogram 

![[IMG-20250402222526170.png|100]]


|WHAT IT IS|DESCRIPTION|
|---|---|
|Basic Idea|Groups data into bins.<br>Bar height shows frequency.|
|Parts|• Data bins (intervals)<br>• Bar heights (frequencies)<br>• X-axis (data range)<br>• Y-axis (counts)|
|What You Can Do|• See distribution shape<br>• Find central values<br>• Identify outliers<br>• Compare data groups|



---

<split even gap="2">

![[IMG-20250402222526186.png|200]]

![[IMG-20250402222526204.png|600]]


</split>

---

## Let us look at some Titanic data. 

Here is a data dictionary: 

- **Status**: Whether they were first-class, third-class, second-class or the crew
- **Survived**: Did they survive?
- **Age**: Adult or child?
- **Sex**: Male or Female?

---

## We'll form some research questions

- Who survived the most in the crash? 
- How many adult males survived compared to adult females?

---

## Is there a relationship between status and and survival?


Plug this into the `Mosaic Plot` with these settings

![[IMG-20250402222526219.png|300]]


---

![[IMG-20250402222526236.png|600]]

---

## To spot data types, you need to ask questions! 

<div class="compact-table table-full">

| Type         | Question Words                  | Description                                                                                        | Operations           | Examples                                                                  |
| ------------ | ------------------------------- | -------------------------------------------------------------------------------------------------- | -------------------- | ------------------------------------------------------------------------- |
| **Ratio**    | How many/much? When? How often? | Quantities with scale & meaningful zero.<br>**Differences and ratios/products are meaningful**     | Correlation          | Length, Weight, Time, Temperature (K),<br>Currency, Counts, Concentration |
| **Interval** | How many/much? When?            | Quantities with scale but no meaningful zero.<br>**Differences meaningful, but not ratios**        | Mean, SD             | Temperature (°C, °F), Dates,<br>pH, Test scores (SAT, IQ)                 |
| **Ordinal**  | How? What kind/sort?            | Categories with specific order/ranking.<br>**Items in defined order** (e.g., small, medium, large) | Median<br>Percentile | Education levels, Ratings,<br>Socioeconomic status, Likert scales         |
| **Nominal**  | What? Who? Where? Which?        | Categories with no inherent order.<br>**Names, places, things**                                    | Count, Mode<br>      | Names, Gender, Colors,<br>Blood types, Countries, Categories              |

</div>

_Selecting the right data type is crucial for proper analysis and visualization_


---

Why bother visualizing?

---


> Getting information from a table is like extracting
sunlight from a cucumber.  ~ Farquhar & Farquhar,
1891

---
<iframe src="https://teaching.aman.bh/iframes/datasaurus" height="585px" style="overflow-y:hidden;" width="900px"/>

---


### Made it to the end of day 2

Congratulations, aapko analyst hua hai.

