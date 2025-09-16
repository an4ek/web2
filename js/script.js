$(document).ready(function() {
    // Выпадающее меню
    $('.hamburger').click(function() {
        $('.nav-menu').toggleClass('active');
        $('body').toggleClass('no-scroll');
    });

    // Закрытие меню при клике на пункт (для мобильных)
    $('.nav-menu a').click(function() {
        if ($(window).width() < 768) {
            $('.nav-menu').removeClass('active');
            $('body').removeClass('no-scroll');
        }
    });

    // Модальное окно обратной связи
    $('#openFeedback').click(function() {
        $('#feedbackModal').fadeIn();
        $('body').addClass('no-scroll');
    });

    $('.close').click(function() {
        $('#feedbackModal').fadeOut();
        $('body').removeClass('no-scroll');
    });

    $(window).click(function(event) {
        if ($(event.target).is('#feedbackModal')) {
            $('#feedbackModal').fadeOut();
            $('body').removeClass('no-scroll');
        }
    });

    // Валидация и отправка формы
    $('#feedbackForm').submit(function(e) {
        e.preventDefault();

        let isValid = true;

        // Валидация имени
        if ($('#name').val().trim() === '') {
            $('#name').siblings('.error-message').text('Пожалуйста, введите ваше имя');
            isValid = false;
        } else {
            $('#name').siblings('.error-message').text('');
        }

        // Валидация email
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test($('#email').val())) {
            $('#email').siblings('.error-message').text('Пожалуйста, введите корректный email');
            isValid = false;
        } else {
            $('#email').siblings('.error-message').text('');
        }

        // Валидация сообщения
        if ($('#message').val().trim() === '') {
            $('#message').siblings('.error-message').text('Пожалуйста, введите ваше сообщение');
            isValid = false;
        } else {
            $('#message').siblings('.error-message').text('');
        }

        if (isValid) {
            // Симуляция отправки формы через AJAX
            const submitBtn = $('.submit-btn');
            const originalText = submitBtn.text();

            submitBtn.text('Отправка...').prop('disabled', true);

            setTimeout(function() {
                alert('Сообщение успешно отправлено!');
                $('#feedbackForm')[0].reset();
                $('#feedbackModal').fadeOut();
                $('body').removeClass('no-scroll');
                submitBtn.text(originalText).prop('disabled', false);
            }, 1500);
        }
    });

    // Загрузка портфолио из JSON
    $.getJSON('data/portfolio.json', function(data) {
        const portfolioGrid = $('.portfolio-grid');

        // Очищаем контейнер перед добавлением новых карточек
        portfolioGrid.empty();

        $.each(data.projects, function(index, project) {
            const projectCard = `
                <a href="${project.link}" class="portfolio-card fade-in" target="_blank" rel="noopener noreferrer">
                    <img src="${project.image}" alt="${project.title}">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                </a>
            `;
            portfolioGrid.append(projectCard);
        });

        // Анимация появления карточек
        setTimeout(function() {
            $('.portfolio-card').each(function(i) {
                $(this).delay(i * 200).queue(function() {
                    $(this).addClass('visible').dequeue();
                });
            });
        }, 500);
    }).fail(function() {
        console.error('Ошибка загрузки портфолио');
        $('.portfolio-grid').html('<p>Не удалось загрузить проекты. Пожалуйста, попробуйте позже.</p>');
    });

    // Карусель навыков
    const track = $('.carousel-track');
    const cards = $('.skill-card');
    const cardWidth = cards.outerWidth(true);
    const visibleCards = 3;
    let currentPosition = 0;
    const maxPosition = cards.length - visibleCards;

    $('.next').click(function() {
        if (currentPosition < maxPosition) {
            currentPosition++;
            updateCarousel();
        }
    });

    $('.prev').click(function() {
        if (currentPosition > 0) {
            currentPosition--;
            updateCarousel();
        }
    });

    function updateCarousel() {
        const moveX = -currentPosition * cardWidth;
        track.css('transform', `translateX(${moveX}px)`);
    }

    // Автопрокрутка карусели
    let carouselInterval = setInterval(function() {
        if (currentPosition < maxPosition) {
            currentPosition++;
        } else {
            currentPosition = 0;
        }
        updateCarousel();
    }, 3000);

    // Остановка автопрокрутки при наведении
    $('.skills-carousel').hover(
        function() {
            clearInterval(carouselInterval);
        },
        function() {
            carouselInterval = setInterval(function() {
                if (currentPosition < maxPosition) {
                    currentPosition++;
                } else {
                    currentPosition = 0;
                }
                updateCarousel();
            }, 3000);
        }
    );

    // Подсветка активного пункта меню при скролле
    $(window).scroll(function() {
        const scrollPosition = $(this).scrollTop();
        const headerHeight = $('.header').outerHeight();
        const windowHeight = $(window).height();
        const documentHeight = $(document).height();

        $('section').each(function() {
            const sectionTop = $(this).offset().top - headerHeight - 50;
            const sectionBottom = sectionTop + $(this).outerHeight();
            const sectionId = $(this).attr('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                $('.nav-menu a').removeClass('active');
                $(`.nav-menu a[href="#${sectionId}"]`).addClass('active');
            }
        });



        // Анимация появления секций при скролле
        $('.section').each(function() {
            const sectionTop = $(this).offset().top;
            const sectionBottom = sectionTop + $(this).outerHeight();
            const scrollPos = $(window).scrollTop() + $(window).height() * 0.8;

            if (scrollPos > sectionTop) {
                $(this).addClass('visible');
            }
        });
    }).scroll();

    // Кнопка "Вверх"
    $(window).scroll(function() {
        if ($(this).scrollTop() > 300) {
            $('#scrollToTop').fadeIn();
        } else {
            $('#scrollToTop').fadeOut();
        }
    });

    $('#scrollToTop').click(function() {
        $('html, body').animate({ scrollTop: 0 }, 800);
        return false;
    });

    // Плавная прокрутка к секциям
    $('a[href^="#"]').on('click', function(e) {
        if ($(this).attr('href') === '#') return;

        e.preventDefault();
        const target = $($(this).attr('href'));
        if (target.length) {
            $('html, body').animate({
                scrollTop: target.offset().top - $('.header').outerHeight()
            }, 800);

            // Закрытие меню на мобильных после клика
            if ($(window).width() < 768) {
                $('.nav-menu').removeClass('active');
                $('body').removeClass('no-scroll');
            }
        }
    });
});