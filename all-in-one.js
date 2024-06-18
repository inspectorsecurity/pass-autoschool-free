import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let answersList = JSON.parse(fs.readFileSync('correct_options.json', 'utf8'));


const urlRefreshToken = 'https://cab.autoinline.com/api/token/refresh/';
const headersRefreshToken = {
    'Host': 'cab.autoinline.com',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:127.0) Gecko/20100101 Firefox/127.0',
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'ru-RU,ru;q=0.8,en-US;q=0.5,en;q=0.3',
    'Content-Type': 'application/json;charset=utf-8',
    'Origin': 'https://lk.autoinline.com',
    'Referer': 'https://lk.autoinline.com/',
    'Connection': 'keep-alive'
};


// Укажите свой refresh токен
const bodyRefreshToken = JSON.stringify({
    refresh: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcxODY1Nzc3NywianRpIjoiY2E4MjhlYzY3Y2VhNDgxOGEwZGJkNjAwMTE0YWFmZWEiLCJ1c2VyX2lkIjozODgwNjB9.ZTBCwdDcqKSD_A6i3eeG1CHTHlKiuFLb9onjYuu6fNk"
});


const performRequest = async (lessonId, answersList) => {
    try {

        // First request to get the access token
        const responseRefreshToken = await fetch(urlRefreshToken, {
            method: 'POST',
            headers: headersRefreshToken,
            body: bodyRefreshToken
        });
        const dataRefreshToken = await responseRefreshToken.json();
        const accessToken = dataRefreshToken.access;
        console.log('Access Token:', accessToken);

        // Second request to mark video as viewed
        const urlVideoViewed = `https://cab.autoinline.com/api/lessons/${lessonId}/training-progress/?category=b`;
        const headersVideoViewed = {
            ...headersRefreshToken,
            'Authorization': `Bearer ${accessToken}`
        };
        const bodyVideoViewed = JSON.stringify({
            lesson_last_time: 2147483647,
            is_lesson_viewed: true,
            id: lessonId
        });

        await fetch(urlVideoViewed, {
            method: 'PATCH',
            headers: headersVideoViewed,
            body: bodyVideoViewed
        });
        console.log('Video Viewed:', lessonId);

        // Pause for 3 seconds before making the third request
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Third request to get the lesson credit token (credit: false)
        const urlLessonCredits = 'https://cab.autoinline.com/api/lesson_credits/';
        const headersLessonCredits = {
            ...headersVideoViewed
        };
        const bodyLessonCreditsFalse = JSON.stringify({
            lesson_id: lessonId,
            credit: false,
            category: "b"
        });

        const responseLessonCreditsFalse = await fetch(urlLessonCredits, {
            method: 'POST',
            headers: headersLessonCredits,
            body: bodyLessonCreditsFalse
        });
        const dataLessonCreditsFalse = await responseLessonCreditsFalse.json();
        const creditTokenFalse = dataLessonCreditsFalse.token; // Получаем credit_token из поля token
        console.log('Credit Token (false):', creditTokenFalse);




        // Fourth request using the credit token (credit: false)
        const urlQuestions = 'https://cab.autoinline.com/api/lesson_credits/';
        const headersQuestions = {
            ...headersLessonCredits
        };
        // const bodyQuestions = JSON.stringify({
        //     credit_token: creditTokenFalse,
        //     answers: answersList
        // });


        // GET ANSWERS
        const urlGetQuestions = `https://cab.autoinline.com/api/questions/?credit_token=${creditTokenFalse}`;
        const headersGetQuestions = {
            ...headersRefreshToken,
            'Authorization': `Bearer ${accessToken}`
        };

        const responseGetQuestions = await fetch(urlGetQuestions, {
            method: 'GET',
            headers: headersGetQuestions
        });
        const dataGetQuestions = await responseGetQuestions.json();
        console.log('Response from GET request:', dataGetQuestions);

        // Write GET response to JSON file
        const correctOptions = dataGetQuestions
            .sort((a, b) => a.id - b.id)
            .map(question => `"${question.id}":${question.correct_option_id}`)
            .join(',');

        // await fs.appendFile(`question_data.txt`, correctOptions);

        // Add new data to the object
        // let jsonData;
        const filePath = path.join(__dirname, 'correct_options.json');
        const existingData = await fs.readFileSync('correct_options.json', 'utf8');
        let jsonData = JSON.parse(existingData);
        // console.log('jsonData', jsonData)

        const newDataString = `{${correctOptions}}`;
        // console.log(newDataString)

        const newData = JSON.parse(newDataString);
        console.log("NEW DATA", newData)

        const mergedJsonData = { ...jsonData, ...newData };
        // console.log('jsonData NEW', mergedJsonData)

        // Write the updated JSON object back to the file
        // await fs.writeFile(path.join(__dirname, 'NEW.txt'), JSON.stringify(jsonData, null, 2));
        await fs.writeFile(filePath, JSON.stringify(mergedJsonData, null, 2), (err) => {
            if (err) throw err;
            console.log(`File written to newFILE.txt`);
        });

        const bodyQuestionsNew = JSON.stringify({
            credit_token: creditTokenFalse,
            answers: mergedJsonData
        });

        const responseQuestions = await fetch(urlQuestions, {
            method: 'PUT',
            headers: headersQuestions,
            body: bodyQuestionsNew
        });
        const dataQuestions = await responseQuestions.json();
        console.log('Response from PUT request (credit: false):', dataQuestions);

        // Pause for 3 seconds before making the new third request
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Third request to get the lesson credit token (credit: true)
        const bodyLessonCreditsTrue = JSON.stringify({
            lesson_id: lessonId,
            credit: true,
            category: "b"
        });

        const responseLessonCreditsTrue = await fetch(urlLessonCredits, {
            method: 'POST',
            headers: headersLessonCredits,
            body: bodyLessonCreditsTrue
        });
        const dataLessonCreditsTrue = await responseLessonCreditsTrue.json();
        const creditTokenTrue = dataLessonCreditsTrue.token; // Получаем credit_token из поля token
        console.log('Credit Token (true):', creditTokenTrue);

        // Fourth request using the credit token (credit: true)
        const bodyQuestionsTrue = JSON.stringify({
            credit_token: creditTokenTrue,
            answers: mergedJsonData
        });

        const responseQuestionsTrue = await fetch(urlQuestions, {
            method: 'PUT',
            headers: headersQuestions,
            body: bodyQuestionsTrue
        });
        const dataQuestionsTrue = await responseQuestionsTrue.json();
        console.log('Response from PUT request (credit: true):', dataQuestionsTrue);

    } catch (error) {
        console.error('Error:', error);
    }
};

const additionalRequest = async (answersList) => {
    try {
        const responseRefreshToken = await fetch(urlRefreshToken, {
            method: 'POST',
            headers: headersRefreshToken,
            body: bodyRefreshToken
        });
        const dataRefreshToken = await responseRefreshToken.json();
        const accessToken = dataRefreshToken.access;

        const urlGroupCredits = 'https://cab.autoinline.com/api/group_credits/';
        const headersGroupCredits = {
            ...headersRefreshToken,
            'Authorization': `Bearer ${accessToken}`
        };
        const bodyGroupCredits = JSON.stringify({
            category: "b"
        });

        const responseGroupCredits = await fetch(urlGroupCredits, {
            method: 'POST',
            headers: headersGroupCredits,
            body: bodyGroupCredits
        });

        const dataGroupCredits = await responseGroupCredits.json();
        console.log('Response from group credits request:', dataGroupCredits);

        const creditToken = dataGroupCredits.token; // Assuming the token is in the response

        // Third request using the group credit token
        const bodyGroupQuestions = JSON.stringify({
            credit_token: creditToken,
            answers: answersList
        });

        const responseGroupQuestions = await fetch(urlGroupCredits, {
            method: 'PUT',
            headers: headersGroupCredits,
            body: bodyGroupQuestions
        });
        const dataGroupQuestions = await responseGroupQuestions.json();
        console.log('Response from group credits PUT request:', dataGroupQuestions);

        console.log('Additional request executed');
    } catch (error) {
        console.error('Error in additional request:', error);
    }
};

const executeRequests = async () => {
    for (let lessonId = 1; lessonId <= 150; lessonId++) {
        await performRequest(lessonId, answersList);
        if ((lessonId - 0) % 3 === 0) {
            await additionalRequest(answersList);
        }
    }
};

executeRequests();
