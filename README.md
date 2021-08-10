#Coding challenge solution

==============================================

The subtite endpoint pushes the words to the queue
----------

Get API running
----------------------------
```
npm install
npm run start
```

start consumer
----------------------------
```
npm run consumer
```

Run test
----------------------------
```
npm run test
```

## Routes
!important - All routes must contain a Authentication header

Service NAME     			| END POINT                  | Description
--------------------------- | ---------------------------|---------------------
 base url                   | /                          | Base Endpoint
 subtitle                   | /upload_subtitle           | POST   Upload subtitle
 TMS                        | /store_translation         | POST Add subtitles to lib
 TMS                        | /translation               | GET Translation



**Sample Request and Response for Upload subtitle:** POST
```
localhost:3006/upload_subtitle
form-data
#Request
    {
	email: "test@gmail.com"
  sourceLanguage: 'en',
  targetLanguage: 'de
  subtitle: subtitle.txt
    }
#Response
{
    "error": false,
    "code": 200,
    "message": "subtitle added successfully"
}
```

**Sample Request and Response for getting users:** GET
```
localhost:3006/translation
Query parameters
  target
  source
  word
#Response
{
    "error": false,
    "code": 200,
    "message": "translation gotten successfully",
    "data": {
        "word": "Hallo",
        "translated": true
    }
}
```

**Sample Request and Response for creating hobbies:** POST
```
localhost:3006/store_translation
Body parameters
#Request
[
  {
    "sourc": "I am Arwen - I've come to help you",
    "targe": "Ich bin Arwen - Ich bin gekommen, um dir zu helfen",
		"sourceLanguag": "en",
		"targetLanguag": "de"
  },
  {
    "source": "Come back to the light",
    "target": "Komm zurück zum Licht",
		"sourceLanguage": "en",
		"targetLanguage": "de"
  },
  {
    "source": "Nooo, my precious",
    "target": "Nein, my Schatz.",
		"sourceLanguage": "en",
		"targetLanguage": "de"
  }
]
#Response
{
    "error": false,
    "code": 200,
    "message": "translation saved successfully"
}
```

**Environment Variables:**
```
PORT=1234
MAIL_USER='email'
MAIL_PASSWORD='password'
BASE_URL=test.com
REDIS_HOST='localhost'
REDIS_PORT=6379
REDIS_DB=0
RABBIT_HOST=''
RABBIT_PORT=''
RABBIT_USER=''
RABBIT_PASS=''
ELASTIC_HOST='localhost'
ELASTIC_PORT='9200'
```



# Coding challenge

Hi Michael!

Thanks for taking your time to work on this coding challenge.

Ideally this test should take a day or two. But feel free to take as much time as you need. Quality is more important than speed. Latest delivery though is in one week starting now.

This coding challenge will show us some of your skills. And you get to know our work flow as well. The solution of the challenge is not too hard. So you can focus on technology and code. Show us what you got! 😉

## Todo

1. Clone this repo.
2. Create a new development branch.
3. Use as many commits as you can so we can see your progress.
4. After finishing your work, create a Pull Request to the master branch.
5. Be ready to answer question.

## Requirements

- The task must be developed in NodeJS.
- Write tests where applicable/necessary.
- All code as well as documentation or comments must be in english.
- Provide instructions on how to run the project.

## Business description

A Subtitles Translator is a service that translates subtitles, it takes one or several subtitle files as input and produces the subtitles in the same format containing the translations of each one of the contained sentences. The translation is performed by using historical data stored in a [Translation Management System (TMS)](https://en.wikipedia.org/wiki/Translation_management_system). One translation is performed by going through the following steps:

1. Parses the subtitles file and extract the translatable source.
2. Translates the source using historical data.
3. Pairs the result with the source.
4. Reconstructs the subtitles file.

Below you can find an example of how a subtitles file looks like:

```
1 [00:00:12.00 - 00:01:20.00] I am Arwen - I've come to help you.
2 [00:03:55.00 - 00:04:20.00] Come back to the light.
3 [00:04:59.00 - 00:05:30.00] Nooo, my precious!!.
```

Is basically conformed by the id of the line, the time range, and then the content to be translated.

The output for this input would be a file containing something as:

```
1 [00:00:12.00 - 00:01:20.00] Ich bin Arwen - Ich bin gekommen, um dir zu helfen.
2 [00:03:55.00 - 00:04:20.00] Komm zurück zum Licht.
3 [00:04:59.00 - 00:05:30.00] Nein, my Schatz!!.
```

The second part of the system is the aforementioned TMS, as its name states, is a system that stores past translations to be reused, the structure of this system is really simple, it contains two endpoints, one for translating and the other for introducing data. 

In order to translate a query, it uses the following flow:

1. Search for strings that are **approximately** equal in the database — They might not be the same but close enough to be consider a translation.
2. It calculates the distance between the query and the closest string found. — A standard way of calculating strings distance is by using [Levenshtein distance algorithm](https://en.wikipedia.org/wiki/Levenshtein_distance).
3. If the distance is less than 5, is considered a translation, otherwise the same query is returned as result.

In order to import data, it uses the following structure:

```json
[
  {
    "source": "Hello World",
    "target": "Hallo Welt",
		"sourceLanguage": "en",
		"targetLanguage": "de"
  },
  {
    "source": "Hello guys",
    "target": "Hallo Leute",
		"sourceLanguage": "en",
		"targetLanguage": "de"
  },
  {
    "source": "I walk to the supermarket",
    "target": "Ich gehe zum Supermarkt.",
		"sourceLanguage": "en",
		"targetLanguage": "de"
  }
]
```

## Task

Your task is:

1. Create a REST API for uploading subtitles in a plain text format (.txt) and send an email with the translation as attachment once the process done.
2. Create the TMS either inside or outside the document translator (however you feel is the best way) with the two endpoints stated before.

Feel free to define yourself the API contracts and the project structure.

## Bonus point

- Creativity.
- Clean code.
- Usage of best practices.
- Usage of Typescript.
- Usage of Docker.

We wish you the best of lucks 🙏! 
