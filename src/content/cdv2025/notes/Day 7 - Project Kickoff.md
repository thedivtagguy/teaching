Hello! Today we'll begin our final projects, which will end in us making some nice infographics and trying to tell a story about one of these datasets.


## Datasets

### Spotify  Songs

Analyze the danceability, energy or other variables of songs on Spotify. When was Justin Bieber's most quiet phase? Did The Weeknd's music get sadder over time? The possibilities are endless!

This dataset contains all sorts of juicy attributes about songs - everything from how danceable they are to whether they make you feel happy or sad. Spotify uses machine learning algorithms to generate these attributes, assigning numerical values to qualities we usually think of as subjective.

#### Possible questions

- Have songs gotten happier or sadder over time?
- Which genres have the most danceable tracks?
- Are more popular songs typically louder?
- How do different artists' musical signatures compare? (Like Taylor Swift vs. Drake on energy or acousticness)
- Can we spot trends in song length across decades or genres?

| Variable                 | Data Type         | Explanation                                                                       |
| ------------------------ | ----------------- | --------------------------------------------------------------------------------- |
| track_id                 | Categorical       | A unique code that identifies each song (like a social security number for songs) |
| track_name               | Categorical       | The title of the song                                                             |
| track_artist             | Categorical       | Who performed the song                                                            |
| track_popularity         | Numeric (0-100)   | How popular the song is, with 100 being super popular                             |
| track_album_id           | Categorical       | A unique code for the album                                                       |
| track_album_name         | Categorical       | The name of the album the song is on                                              |
| track_album_release_date | Categorical       | When the album was released                                                       |
| playlist_name            | Categorical       | The name of the playlist containing the song                                      |
| playlist_id              | Categorical       | A unique code for the playlist                                                    |
| playlist_genre           | Categorical       | The main music style of the playlist (rock, pop, etc.)                            |
| playlist_subgenre        | Categorical       | A more specific music style within the genre                                      |
| danceability             | Numeric (0.0-1.0) | How good the song is for dancing (1.0 = perfect for dancing)                      |
| energy                   | Numeric (0.0-1.0) | How energetic the song feels (1.0 = very high energy)                             |
| key                      | Numeric (0-11)    | What musical key the song is in (0 = C, 1 = C♯/D♭, etc.)                          |
| loudness                 | Numeric (dB)      | How loud the song is (typically between -60 and 0)                                |
| mode                     | Numeric (0 or 1)  | Whether the song is in a minor (0) or major (1) key                               |
| speechiness              | Numeric (0.0-1.0) | How much spoken word is in the song (high = more talking)                         |
| acousticness             | Numeric (0.0-1.0) | How acoustic the song is (1.0 = definitely acoustic)                              |
| instrumentalness         | Numeric (0.0-1.0) | How likely the song has no vocals (1.0 = instrumental)                            |
| liveness                 | Numeric (0.0-1.0) | How likely the song was recorded live (0.8+ = probably live)                      |
| valence                  | Numeric (0.0-1.0) | How positive/happy the song sounds (1.0 = very happy)                             |
| tempo                    | Numeric (BPM)     | How fast the song is in beats per minute                                          |
| duration_ms              | Numeric           | How long the song is in milliseconds (divide by 1000 for seconds)                 |
### Titanic Passengers

This dataset lets us explore who survived and who didn't during this maritime disaster.

Remember our class example with the mosaic plot? Now you can dive deeper and create your own analysis. Fascinating possibilities for visuals too.

#### Possible Questions

- Did "women and children first" really happen?
- How much did your ticket class affect your chances of survival?
- Did traveling with family help or hurt your chances?

| Variable  | Data Type           | Explanation                                                                   |
| --------- | ------------------- | ----------------------------------------------------------------------------- |
| pclass    | Categorical (1,2,3) | Passenger class - 1st, 2nd, or 3rd class ticket                               |
| survived  | Categorical (0,1)   | Whether the passenger survived (1) or died (0)                                |
| name      | Categorical         | Passenger's full name, often including title (Mr., Mrs., etc.)                |
| sex       | Categorical         | Passenger's gender (male or female)                                           |
| age       | Numeric             | Passenger's age in years (fractional for children under 1)                    |
| sibsp     | Numeric             | Number of siblings/spouses the passenger had aboard                           |
| parch     | Numeric             | Number of parents/children the passenger had aboard                           |
| ticket    | Categorical         | Ticket number                                                                 |
| fare      | Numeric             | How much the passenger paid for their ticket (in pounds)                      |
| cabin     | Categorical         | Cabin number (many are missing)                                               |
| embarked  | Categorical         | Port where passenger boarded (C = Cherbourg, Q = Queenstown, S = Southampton) |
| boat      | Categorical         | Lifeboat number (if survived)                                                 |
| body      | Numeric             | Body identification number (if not survived and body recovered)               |
| home.dest | Categorical         | Home or destination location                                                  |
### Global Human Day 

This dataset shows how people around the world spend their time each day - capturing what the average day looks like across different countries. It's a 24-hour snapshot of humanity!

#### Possible Questions

- Which countries have the best work-life balance?
- Where do people spend the most time on leisure?
- How does childcare time vary across the world?
- Is there a connection between a country's wealth and how people spend their time?
- Which regions get the most sleep?

|Variable|Data Type|Explanation|
|---|---|---|
|Category|Categorical|Main category of time use activities (from M24 classification system)|
|Subcategory|Categorical|More specific subcategory of time use activities (from M24 classification)|
|country_iso3|Categorical|Three-letter country code that uniquely identifies each country (ISO standard)|
|region_code|Categorical|Code that identifies which geographical region the country belongs to|
|population|Numeric|Total number of people living in the country|
|hoursPerDayCombined|Numeric|Average number of hours per day spent on this activity in this country|
|uncertaintyCombined|Numeric|Statistical measurement of the variance or uncertainty in the time use data|

### Global Student-Teacher Ratio

The student-teacher ratio is a great proxy for educational investment. Lower ratios (fewer students per teacher) generally mean more resources devoted to education.

This dataset spans multiple years and education levels, letting you see how things have changed over time. Are countries improving their education systems, or are classrooms getting more crowded?
#### Possible Questions

- Which countries have the lowest (best) student-teacher ratios?
- Has the global situation improved or gotten worse over time?
- How do primary education ratios compare to higher education?
- Are there regional patterns in educational resourcing?
- Is there a relationship between a country's wealth and its education investment?

|Variable|Data Type|Explanation|
|---|---|---|
|edulit_ind|Categorical|Unique identifier code for each education indicator record|
|indicator|Categorical|Education level being measured (e.g., "Primary Education", "Tertiary Education")|
|country_code|Categorical|Standard code that uniquely identifies each country|
|country|Categorical|Full name of the country|
|year|Numeric|Year when the data was collected|
|student_ratio|Numeric|Number of students per teacher (lower values mean fewer students per teacher)|
|flag_codes|Categorical|Codes that indicate special conditions or exceptions in the data collection|
|flags|Categorical|Detailed explanation of any exceptions, special circumstances, or data limitations|

## Proposed Outline 

#### Tuesday

**Morning:** Question Formulation & Dataset Selection
- Define clear research questions for your chosen dataset
- Explore datasets and select the one that interests you most

**Afternoon:** Initial Data Exploration
- Load dataset into Orange
- Examine data structure using Feature Statistics
- Create first exploratory visualizations to identify patterns
- Begin sketching poster concepts based on initial findings
## Wednesday

**Morning:** Data Summarization & Design
- Use Group By to create meaningful summaries
- Export your summarized dataset
- Start designing your poster layout
- Select color schemes and typography

**Afternoon:** Visualization Creation
- Build your visualizations in Datawrapper/Rawgraphs
- Incorporate visualizations into your poster design
- Add preliminary titles, annotations, and context

## Thursday

**Morning:** Design Refinement
- Polish your visualizations
- Improve titles and annotations
- Ensure your poster tells a clear story

**Afternoon:** Final Production & Presentation
- Complete final design adjustments
- Produce final poster