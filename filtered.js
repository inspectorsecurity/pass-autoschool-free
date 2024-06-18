const data = [{"id":855,"image":null,"question_text":"Какое место в автомобиле считается наиболее опасным?","description":"<p>Согласно результатам исследований, проведённых в США, наиболее опасным в салоне легкового автомобиля является место&nbsp;на переднем пассажирском сидении. Далее по убыванию степени опасности идут водительское место. За ним следуют задние пассажирские места справа и слева. И самым безопасным согласно этих исследований считается заднее пассажирское место в центре.&nbsp;</p>","correct_option_id":2662,"questionoption_set":[{"id":2660,"text":"Заднее пассажирское в центре."},{"id":2661,"text":"Заднее пассажирское за водителем."},{"id":2662,"text":"Переднее пассажирское."},{"id":2663,"text":"Место водителя."}]},{"id":853,"image":null,"question_text":"На какое время суток приходится наибольшее количество ДТП?","description":"<p>Следует сказать, что распределение Дорожно-транспортных происшествий по времени суток, по дням недели и по месяцам неравномерное. Наибольшее количество Дорожно-транспортных происшествий происходит в вечернее время, с 18 до 22 часов.&nbsp;Именно на это время приходится треть всех дорожно-транспортных происшествий.&nbsp;</p>","correct_option_id":2656,"questionoption_set":[{"id":2654,"text":"С 8 до 10 часов."},{"id":2655,"text":"С 12 до 13 часов."},{"id":2656,"text":"С 18 до 20 часов."}]},{"id":854,"image":null,"question_text":"На какой день недели приходится наибольшее количество ДТП?","description":"<p>По дням недели наибольшее количество ДТП происходит в пятницу, когда после рабочего дня водители устремляются за город.&nbsp;</p>","correct_option_id":2658,"questionoption_set":[{"id":2657,"text":"Понедельник."},{"id":2658,"text":"Пятница."},{"id":2659,"text":"Среда."}]},{"id":856,"image":null,"question_text":"Существует ли верный практический способ избежать развития ДТП","description":"<p>На самом деле не существует точного и однозначного ответа на вопрос что делать в опасной ситуации чтобы не попасть в ДТП. В различных обстоятельствах действия водителя должны быть различными. Правильное решение из всех возможных вариантов водитель должен принимать сам на основе имеющегося опыта вождения.</p>","correct_option_id":2665,"questionoption_set":[{"id":2664,"text":"Да. Для этого нужно лишь соблюдать Правила."},{"id":2665,"text":"Нет. В каждой конкретной ситуации водитель должен сам определять наиболее эффективный способ избежать ДТП."}]},{"id":852,"image":null,"question_text":"Какое первое в истории ДТП произошло с участием автомобиля?","description":"<p>Несмотря на то, что скорость движения первых автомобилей была невелика, первое дорожно-транспортное происшествие, было зарегистрировано всего через 10 лет после изобретения автомобиля. Этим происшествием стал наезд на пешехода. Далее в 1899 г. такое же происшествие закончилось уже трагически, а именно смертью человека.&nbsp;</p>","correct_option_id":2652,"questionoption_set":[{"id":2650,"text":"Столкновение с гужевой повозкой."},{"id":2651,"text":"Столкновение с другим автомобилем."},{"id":2652,"text":"Наезд на пешехода."},{"id":2653,"text":"Наезд на животное."}]}]

const correctOptions = data
    .sort((a, b) => a.id - b.id)
    .map(question => `"${question.id}":${question.correct_option_id}`)
    .join(',');

console.log(correctOptions);