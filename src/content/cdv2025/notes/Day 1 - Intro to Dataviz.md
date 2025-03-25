---
theme: css/reveal-theme.css
transition:
---
# Introduction to Information and Data visualization 

Facilitator: Aman Bhargava

 **Session 1** 

---

## To understand the origins of modern data visualization,  we start in London in 1850

Try to imagine yourself walking its streets in the mid-19th century.

note: Data visualization is often associated with business meetings and shiny boardrooms, but its origins were very different.

---

Between 1848 to 1854, cholera was one of the most feared diseases in the city.

Most people blamed "miasmas" - invisible poisonous particles from decomposing matter or bad smells. This theory seemed plausible since disease-ridden slums often did smell terrible.

![[IMG-20250324070803075.png|600]]
<cite>

https://www.sciencemuseum.org.uk/objects-and-stories/medicine/cholera-victorian-london
</cite>
---

![[IMG-20250316202634916.png]]

<cite>

‘“Cholera Preventive Costume”, Print, England, 1832 | Science Museum Group Collection’. Accessed 16 March 2025. [https://collection.sciencemuseumgroup.org.uk/objects/co66665/cholera-preventive-costume-print-england-1832](https://collection.sciencemuseumgroup.org.uk/objects/co66665/cholera-preventive-costume-print-england-1832).

</cite>


---
<split even gap="2">
<div>

### Enter John Snow.

He suspected something there was something fundamentally different about cholera that couldn't be explained away by bad air. <!-- element class="fragment" data-fragment-index="2" -->

</div>


<div class="fragment" data-fragment-index="1" data-fragment-state="appearing-only">

![[IMG-20250316211016711.png]]

</div>

</split>

---

To test his theory during the second outbreak, Snow started investigating deaths in the neighbourhood. He went about this in a very methodical way, wanting to relate three distinct things: 

- Proximity to water sources
- Occurence of diseases
- The _density_ of this occurence


---

<!--slide bg="./attachments/Dataviz Course/Day 1 - Intro to Dataviz/IMG-20250317165147855.png" data-background-size="contain"-->

%% <cite style="margin-top:-5rem;">

Source: https://Johnsnow.Matrix.Msu.Edu/documentUploads/15-78-2D2/15-78-2D2-22-1855-07-CIC-AppendixB.Pdf’. Accessed 17 March 2025. 

</cite> %%

---

<!-- slide bg='./attachments/Dataviz Course/Day 1 - Intro to Dataviz/IMG-20250317162753763.png' -->

---

<split even gap="2">
<div>

The map confirmed what Snow's hypothesis and findings - deaths clustered around the Broad Street water pump. The closer people lived to this pump, the more likely they were to die.


</div>


<div class="fragment" data-fragment-index="1" >

![[IMG-20250317174831349.png|400]]

<cite>

Edward Tufte. ‘Visual and Statistical Thinking: Displays of Evidence for Making Decisions’. Accessed 17 March 2025. [https://web.archive.org/web/20140807145142/http://www.sfu.ca/cmns/courses/2012/801/1-Readings/Tufte%20Visual%20and%20Statistical%20Thinking.pdf](https://web.archive.org/web/20140807145142/http://www.sfu.ca/cmns/courses/2012/801/1-Readings/Tufte%20Visual%20and%20Statistical%20Thinking.pdf).

</cite> 



</div>

</split>



---

It is important to remember that John Snow didn't just happen to plot this on a map and come to a realization about the pump's importance. 
It was the **powerful visual evidence of a theory**, and subsequent analysis. 


The visualization transformed the **ideas and numbers into something that could demand action**.

---
<!-- slide bg="./attachments/Dataviz Course/Day 1 - Intro to Dataviz/IMG-20250317165147855.png"-->

<div style="background: white; height: fit-content !important; padding: 3rem; border-radius:1rem;">

Would this have been as persuasive without a visual? 

Perhaps, but perhaps not.

</div>
---

<split even gap='2'>


<div>

## Hello, I'm Aman. 

<br/>

I studied Human-Centered Design at Srishti Institute of Art, Design and Technology and now work as a data visualization designer and developer making this kind of stuff all day every day. 

<br/>



</div>


<div>
![[IMG-20250309164530345.png|500]]

<cite>

Thank you to Rhea for this drawing of me
</cite>
</div>

</split>


---

I liked making stuff like this in college...

![[IMG-20250323183326481.png]]

<cite>

Chat analysis for our college group at the end of its first year

https://aman.bh/projects/whatsapp/
</cite>


---

![[IMG-20250323191829237.png]]

<cite>

https://aman.bh/projects/manifesto
</cite>

---
<split even gap='2'>


<div style="display:flex;align-items:center;">



...and then I worked at Reuters, where I made charts and maps for the newsroom and helped on stories of all sorts.

<br/>




</div>



![[IMG-20250316225008298.png|400]] 



</split>

---


![[IMG-20250323192014304.png|1000]]
<cite>

https://diagramchasing.fun/2024/blr-water-log
</cite>

---


## What is this class and why? 

Data visualization is one of the best intersections of the various facets of design that you often encounter in isolation. 

Design, psychology, storytelling, graphics, art

and of course, 'youeyeyouex'. <!-- element class="fragment" -->

---

![[IMG-20250318122419246.png|750]]


---
And regardless of what you might think,

![[IMG-20250325005926292.png|400]]



---

But first, we need to rewire our brains a little.

We'll focus on understanding fundamental principles, developing critical ways of seeing, learning to ask the right questions of our data for answers, and finally, turning those into beautiful graphics.

We'll read a lot, refer to the works of a diverse group of people, critique, redesign, and make. 

We want to be able to think in terms of data. <!-- element class="fragment" -->

Implementation comes later. Ideas come first. <!-- element class="fragment" -->


---

But for that we need to chase some balloons.

![[IMG-20250318004659043.png|500]]

---
So let's take a step back

### **What is a 'visualization'?** 

---

Well, at the minimum it is something that is:

- Based on some _non-visual data_. 
- Something graphic.

---

<split>


![[IMG-20250323185010720.png|400]]

![[IMG-20250323185829757.png|400]]


</split>

---

<split even gap="2">

![[IMG-20250323185521373.png|400]]

![[IMG-20250323185546111.png|400]]

</split>
---

But to what end?

---

Here's one way of thinking about it:

> Visualizations are **pictures** that help **people** **do things**. <br/>
> Good ones make it **easy to see what's needed**.  

<div>

A visualization then, in our case, is **purposeful**. 
</div>
<!--element class="fragment"-->

---

They can help make a point, like John Snow did. 


Florence Nightingale was a legend in her own lifetime and one of the most famous women in British history. 

![[IMG-20250323212756167.png]]
<cite>

https://www.nam.ac.uk/explore/florence-nightingale-lady-lamp
</cite>

note: At Scutari, near Constantinople, the conditions were dire. The dirty and vermin-ridden hospital lacked even basic equipment and provisions. The medical staff were swamped by the large number of soldiers being shipped across the Black Sea from the war in the Crimea. More of these patients were suffering from disease than from battle wounds.

---

<!-- slide bg="./attachments/Pasted image 20250324071528.png" data-background-size="contain"-->




note: The chart below, which Florence included in one of her books, allowed multiple data comparisons in one diagram. It clearly demonstrated that more soldiers had died in the Crimea in 1855-56 from disease (shown in blue) than from wounds (shown in red).

---
<split even gap="4">
<div>


> Printed tables and all-in double columns, I do not think anyone will read. None but scientific men ever look in the Appendix of a Report. <br/> And this is for the vulgar public.

</div>

<div class="fragment">

![[IMG-20250323213547490.png|400]]

> "She might like the pictures"
</div>
</split>
---


![[IMG-20250323214422306.png|700]]
<cite>

https://historyandpolicy.org/policy-papers/papers/florence-nightingales-public-health-act-covid-19-and-the-empowerment-of-local-government/
</cite>
note: The Nightingale-inspired legislation received Royal Assent as the 1875 Public Health Act. From that date onward, national life expectancy rose steadily, increasing by half before medical science had anything to contribute to the prevention or cure of the principle epidemic diseases (Figure 1).


---


One last heavy-weight!

<img src="[[IMG-20250317234139417.png]]"/>

High res: https://upload.wikimedia.org/wikipedia/commons/2/29/Minard.png

note: It displays six types of data in two dimensions: the number of Napoleon's troops; the distance traveled; temperature; latitude and longitude; direction of travel; and location relative to specific dates without making mention of Napoleon; Minard's interest lay with the travails and sacrifices of the soldiers.[[4]](https://en.wikipedia.org/wiki/Charles_Joseph_Minard#cite_note-corbett-4) This type of band graph for illustration of flows was later called a [Sankey diagram](https://en.wikipedia.org/wiki/Sankey_diagram "Sankey diagram"), although [Matthew Henry Phineas Riall Sankey](https://en.wikipedia.org/wiki/Matthew_Henry_Phineas_Riall_Sankey "Matthew Henry Phineas Riall Sankey") used this visualisation 30 years later and only for thematic energy flow.

---

It can be many, many things, because some form of visualization is everywhere.

---

If you do photography, you've probably seen a histogram:

![[IMG-20250315161301746.png]]

---

...or a map in every IPL match...

![[IMG-20250315161425348.png]]

<cite> 

https://virtualeye.tv/the-sports/virtual-eye-cricket/64-cricket

</cite>

---

...or tracking your running...

![[IMG-20250315162014419.png|400]]

---

...or battery life...

![[IMG-20250315162344296.png]]


---

...or travel...

![[IMG-20250323191207008.png]]

---

 ...sometimes, visualizations become important _verbs_ in themselves, turning into a powerful communication tool...

<split even gap="2">

![[IMG-20250317221009032.png|400]]


![[IMG-20250316215137175.png|400]]

</split>

---

Or symbols of a cause

![[IMG-20250318005051574.png]]

<cite>

https://chezvoila.com/blog/warmingstripes/

</cite>



---

![[IMG-20250318005432064.png|550]]

<cite>

https://chezvoila.com/blog/warmingstripes/

</cite>

---

👀 er....

![[IMG-20250318005529093.png]]


---


Sometimes they also helps us settle scores and insult each other statistically.

![[IMG-20250323094209940.png]]

---

![[IMG-20250323094234696.png|1200]]

---

![[IMG-20250317210759049.png]]
<cite>

https://aman.bh
</cite>


---

Sometimes they help you run communicate issues <sub style="font-size: 14px; display:block;">(for when you run a Instagram account where you shout at people for eating white bread. I'm looking at you, FoodPharmer)</sub>

![[IMG-20250318000833870.png]]

<cite>

https://dataphys.org/list/how-much-sugar-do-you-consume/

</cite>

---

You can make them out of almost anything. Legos can become a city's map, helping you mark where you go: 

![[IMG-20250318001036751.png]]

<cite>

https://dataphys.org/list/psychogeographical-mapping-travel-logging-with-lego-bricks/

</cite>

---

Or perhaps light: 

<split even gap="2">

![[IMG-20250318001335033.png|400]]

![[IMG-20250318001344409.png|400]]


</split>

<cite>

https://niittyvirta.com/lines-57-59-n-7-16w/

</cite>

---

They make for _very cool packaging_

![[IMG-20250318005724401.png]]
<cite>

https://www.bedow.se/work/swee-kombucha/

</cite>

---

![[IMG-20250318005848059.png]]

---

It can also be used to show your wife the enormity of your meth empire.

![[IMG-20250318013346012.png]]  <!--element class="fragment"-->


---

Huey for scale:

<img src="https://i.makeagif.com/media/2-17-2016/7ZoOxX.gif"/>

---

<iframe width="960" height="415" src="https://www.youtube.com/embed/jbkSRLYSojo?si=XZp-zKukNA1JlQDS" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>


---

## Side quest 🗺️

There is something in the previous video that is _obviously_ and absolutely wrong and doesn't make sense. After a little bit of thought, you should be able to figure it out too. Can you guess what it is?

If you figure it out, let's talk about it later!


---



Anyway, so:

<center>

> Visualizations are **pictures** that help **people** **do things**. 
</center>

Those things can be <!--element class="fragment"-->
<span class="fragment">serious,</span> <span class="fragment">fun,</span> <span class="fragment">educational,</span> <span class="fragment">informative,</span> <span class="fragment">elegant,</span> <span class="fragment">emotive,</span> <span class="fragment">or just simply interesting</span>.

---


If we go with the idea that the purpose of a visualization is to help someone do something, then it is equally important to ask **what are you trying to help them do and how will you do it?**



---

Here are some of the responses from the pre-class survey

![[IMG-20250323181126762.png]]
![[IMG-20250323181425377.png|500]] <!--element style="opacity:0;"-->


---
Here are some of the responses from the pre-class survey

![[IMG-20250323181140725.png]]
![[IMG-20250323181425377.png|500]] <!--element style="opacity:0;"-->

---
Here are some of the responses from the pre-class survey

![[IMG-20250323181157591.png]]
![[IMG-20250323181425377.png|500]]


---

## What We'll Cover

<div class="r-stack">
  <span class="fragment fade-in-then-out" data-fragment-index="1">
    <h3>Why Visualization?</h3>
    <p>Understanding how visuals help us understand data</p>
  </span>
  <span class="fragment fade-in-then-out" data-fragment-index="2">
    <h3>Basic Data Analysis</h3>
    <p>Learning to wrangle, summarize, and prepare data</p>
  </span>
  <span class="fragment fade-in-then-out" data-fragment-index="3">
    <h3>Visual Encodings</h3>
    <p>The building blocks of effective visualizations</p>
  </span>
  <span class="fragment fade-in-then-out" data-fragment-index="4">
    <h3>Abstraction</h3>
    <p>Simple frameworks for tasks and data types</p>
  </span>
  <span class="fragment fade-in-then-out" data-fragment-index="5">
    <h3>Critique & Redesign</h3>
    <p>Techniques to analyze and improve existing visualizations</p>
  </span>
  <span class="fragment fade-in-then-out" data-fragment-index="6">
    <h3>Data Storytelling</h3>
    <p>Crafting narratives with data and visuals</p>
  </span>
</div>

---

Each lesson will fall into one of these categories of the dataviz process

<ul> <li class="fragment"><strong>Collect & Clean:</strong> Finding and preparing data</li> <li class="fragment"><strong>Analyze & Summarize:</strong> Understanding key patterns</li> <li class="fragment"><strong>Visualize:</strong> Choosing the right visual formats</li> <li class="fragment"><strong>Narrate:</strong> Creating a story with your data</li> <li class="fragment"><strong>Design:</strong> Making it beautiful and accessible</li> </ul>

---



<split even gap='2'>

<div>

### Monologue break alert (but that means you do something)

[PoKi](https://github.com/whipson/PoKi-Poems-by-Kids) is a corpus of 61,330 poems written by children from grades 1 to 12. The table on the right provides a brief glimpse of how the number of words in PoKi are distributed by age (grade).


**Can you visualize this in whatever way you can think of right now?** No rules, no expectations, just create something! 

**Time: 20 mins**

</div>

<div class="table-wrapper">

| Grade | Average no. of words per poem |
|:-----:|:------------------------:|
| 1     | 37.3                     |
| 2     | 32.1                     |
| 3     | 35.2                     |
| 4     | 39.3                     |
| 5     | 44.5                     |
| 6     | 49.6                     |
| 7     | 59.7                     |
| 8     | 67.6                     |
| 9     | 91.5                     |
| 10    | 91.8                     |
| 11    | 103.0                    |
| 12    | 97.2                     |
| All   | 50.3                     |

</div>
</split>


---

> The purpose of infographics and data visualizations is to enlighten people—not to entertain them, not to sell them products, services, or ideas, but to inform them. It’s as simple—and as complicated—as that.
> ~ Alberto Cairo, The Truthful Art

---

- **Visualization**: A picture that informs.
- **Chart**: A visualization in which data are encoded with symbols.
- **Infographic**: An infographic is a _multi-part_ visual representation of information intended to communicate one or more specific messages. Infographics are made of a mix of charts, maps, illustrations, and text that provides explanation and context.
- **Data visualization**: A data visualization is a display of data designed to enable analysis, exploration, and discovery.


But the boundaries are \*waves hand\* fuzzy.

---


![[IMG-20250321003101686.png]]

<cite>

https://www.economist.com/graphic-detail/2021/08/14/by-the-numbers-lionel-messi-is-european-footballs-best-scorer-ever
</cite>

---

<split even gap="2">

![[IMG-20250321003316361.png|400]]

![[IMG-20250321003508583.png|400]]


</split>

---

![[IMG-20250321221057047.png|1000]]

---
![[IMG-20250321003539825.png|750]]


---

One of the highlights of my life is Adolfo drawing me

![[IMG-20250321003814496.png|500]]

---
<split even>

![[IMG-20250323193148082.png|400]]

![[IMG-20250323193310096.png|400]]

</split>

---

<img src="https://mhinfographics.com/wp-content/uploads/2024/06/flightover_02.gif" width="600"/>

<cite>

https://mhinfographics.com/2024/06/22/visualizing-the-destruction-in-ukraine-a-years-long-project-following-satellite-clues/
</cite>

---

![[IMG-20250323215215409.png]]

---

![[IMG-20250323220002135.png]]

---
![[IMG-20250323220224764.png]]


---
![[IMG-20250324005843027.png]]

---
![[IMG-20250324011024220.png]]

---
![[IMG-20250324012247801.gif]]
<cite>

https://www.nytimes.com/interactive/2023/12/14/opinion/my-life-with-long-covid.html
</cite>

---

## What makes a visualization good?

Get used to not just *looking* at visualizations but to **reading** them.

---

## It is truthful 

![[IMG-20250321005859406.png|500]]

---

![[IMG-20250321012718281.png]]
<cite>

Cairo, Alberto. ‘Graphics Lies, Misleading Visuals: Reflections on the Challenges and Pitfalls of Evidence-Driven Visual Communication’. In _New Challenges for Data Design_, edited by David Bihanic, 103–16. London: Springer London, 2015. [https://doi.org/10.1007/978-1-4471-6596-5_5](https://doi.org/10.1007/978-1-4471-6596-5_5).

</cite>

---

![[IMG-20250321012733471.png]]

<cite>

Cairo, Alberto. ‘Graphics Lies, Misleading Visuals: Reflections on the Challenges and Pitfalls of Evidence-Driven Visual Communication’. In _New Challenges for Data Design_, edited by David Bihanic, 103–16. London: Springer London, 2015. [https://doi.org/10.1007/978-1-4471-6596-5_5](https://doi.org/10.1007/978-1-4471-6596-5_5).

</cite>

---

## It is functional 

![[IMG-20250321011157955.png|800]]

<cite>

https://junkcharts.typepad.com/junk_charts/2019/05/watching-a-valiant-effort-to-rescue-the-pie-chart.html

</cite>

---
![[IMG-20250321011236445.png|600]]

---

If you think I'm exaggerating examples, here's one from last night. 

Please Google, why...

<split even gap="2">

![[IMG-20250323193428122.png|550]]

![[IMG-20250323193550203.png|300]] <!--element class="fragment"-->

</split>

note: talk about the taarak mehta dude 

---
I've whited out the "grouped by" and legend labels, can you guess what the colors represent?

![[IMG-20250324010338378.png]]

---


![[IMG-20250324010354842.png]]

---

## It is beautiful 

![[IMG-20250321012623982.png]]

<cite>

Cairo, Alberto. ‘The Truthful Art’, 

</cite>

<br/>

Data decoration != data visualization <!--element class='fragment'-->

---

<split even>

## It is insightful 


<div>
![[IMG-20250321014006012.png|600]]

<cite>

_The Economist_. ‘Russian Elections Once Again Had a Suspiciously Neat Result’. Accessed 21 March 2025. [https://www.economist.com/graphic-detail/2021/10/11/russian-elections-once-again-had-a-suspiciously-neat-result](https://www.economist.com/graphic-detail/2021/10/11/russian-elections-once-again-had-a-suspiciously-neat-result).

</cite>
</div>
</split>

note: Good visualizations allow people reading them to think more, and incite more discoveries. making valuable discoveries that would be inaccessible if the information were presented in a different way.

---

Is this you? Don't worry, almost done for the day.


![[IMG-20250321014449504.gif|500]]

---


## Activity 2: Lay of the land

In groups of 4, create a survey.  Questions should be specific, measurable, and have something interesting (don't ask people only their height please). 

The only **guideline** is that you need to _end up_ storing data in a Google Sheet. Record however you want initially. 


**Time:** 45 mins

---

### Write down:
- One insight you expect to find in the data
- One relationship between variables you're curious about
- One potential data quality issue you anticipate


---
## Assignment 1
**Due**: 25th March 9 AM

- Browse IIBA longlist or Flowing Data or any of the other lists
- Select 3 projects of interest
- List 2-3 questions each visualization answers
- Critique 2 visualization (3 positives, 3 negatives) 

---

![[IMG-20250324012433448.gif|600]]
