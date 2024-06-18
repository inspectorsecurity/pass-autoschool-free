import fetch from 'node-fetch';
import fs from 'fs';
const urlRefreshToken = 'https://cab.autoinline.com/api/token/refresh/';
const headersRefreshToken = {
    'Host': 'cab.autoinline.com',
    'Sec-Ch-Ua': '"Chromium";v="125", "Not.A/Brand";v="24"',
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json;charset=UTF-8',
    'Sec-Ch-Ua-Mobile': '?0',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.6422.60 Safari/537.36',
    'Sec-Ch-Ua-Platform': '"Windows"',
    'Origin': 'https://lk.autoinline.com',
    'Sec-Fetch-Site': 'same-site',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Dest': 'empty',
    'Referer': 'https://lk.autoinline.com/',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'en-US,en;q=0.9',
    'Priority': 'u=4, i',
    'Connection': 'keep-alive'
};

const bodyRefreshToken = JSON.stringify({
    refresh: ""
});

const urlTicketCredits = 'https://cab.autoinline.com/api/ticket_credits/';
const headersTicketCredits = (accessToken) => ({
    'Host': 'cab.autoinline.com',
    'Sec-Ch-Ua': '"Chromium";v="125", "Not.A/Brand";v="24"',
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json;charset=UTF-8',
    'Sec-Ch-Ua-Mobile': '?0',
    'Authorization': `Bearer ${accessToken}`,
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.6422.60 Safari/537.36',
    'Sec-Ch-Ua-Platform': '"Windows"',
    'Origin': 'https://lk.autoinline.com',
    'Sec-Fetch-Site': 'same-site',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Dest': 'empty',
    'Referer': 'https://lk.autoinline.com/',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'en-US,en;q=0.9',
    'Priority': 'u=4, i',
    'Connection': 'keep-alive'
});

const performRequest = async (ticketNum) => {
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

        // Second request using the access token
        const bodyTicketCredits = JSON.stringify({
            ticket_num: ticketNum,
            credit: false,
            category: "b"
        });

        const responseTicketCredits = await fetch(urlTicketCredits, {
            method: 'POST',
            headers: headersTicketCredits(accessToken),
            body: bodyTicketCredits
        });
        const dataTicketCredits = await responseTicketCredits.json();
        const creditToken = dataTicketCredits.token; // Получаем credit_token из поля token
        console.log('Credit Token:', creditToken);

        // Third request using the access token and credit token
        const urlQuestions = `https://cab.autoinline.com/api/questions/?credit_token=${creditToken}`;
        const headersQuestions = {
            'Host': 'cab.autoinline.com',
            'Sec-Ch-Ua': '"Chromium";v="125", "Not.A/Brand";v="24"',
            'Accept': 'application/json, text/plain, */*',
            'Sec-Ch-Ua-Mobile': '?0',
            'Authorization': `Bearer ${accessToken}`,
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.6422.60 Safari/537.36',
            'Sec-Ch-Ua-Platform': '"Windows"',
            'Origin': 'https://lk.autoinline.com',
            'Sec-Fetch-Site': 'same-site',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Dest': 'empty',
            'Referer': 'https://lk.autoinline.com/',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'en-US,en;q=0.9',
            'Priority': 'u=4, i',
            'Connection': 'keep-alive'
        };

        const responseQuestions = await fetch(urlQuestions, {
            method: 'GET',
            headers: headersQuestions
        });
        const dataQuestions = await responseQuestions.json();

        // Обработка данных и сохранение в файл
        const correctOptions = dataQuestions.map(question => `"${question.id}":${question.correct_option_id}`).join(',');

        // Здесь путь к файлу, куда нужно сохранить данные
        const filePath = './correct_options.json';

        fs.appendFileSync(filePath, `${correctOptions},`);
        console.log(`Correct options saved to ${filePath}`);

    } catch (error) {
        console.error('Error:', error);
        return []; // Возвращаем пустой массив в случае ошибки
    }
};

const executeRequests = async () => {
    for (let i = 1; i <= 40; i++) {
        await performRequest(i);
    }
};

executeRequests();