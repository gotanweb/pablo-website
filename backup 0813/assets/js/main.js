(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();
    
    // Initialize AOS (Animate On Scroll)
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });
    
    // Initiate the wowjs
    new WOW().init();

    // Dark Mode Toggle
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;
    
    // Check for saved dark mode preference
    const darkMode = localStorage.getItem('darkMode');
    if (darkMode === 'enabled') {
        body.classList.add('dark-mode');
        darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    darkModeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        
        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('darkMode', 'enabled');
            darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            localStorage.setItem('darkMode', 'disabled');
            darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
    });

    // Counter Animation
    const counters = document.querySelectorAll('.counter');
    const speed = 200;
    
    const animateCounters = () => {
        counters.forEach(counter => {
            const animate = () => {
                const value = +counter.getAttribute('data-target');
                const data = +counter.innerText;
                
                const time = value / speed;
                if (data < value) {
                    counter.innerText = Math.ceil(data + time);
                    setTimeout(animate, 1);
                } else {
                    counter.innerText = value.toLocaleString();
                }
            }
            animate();
        });
    }
    
    // Trigger counter animation when section is visible
    const observerOptions = {
        threshold: 0.7
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    const portfolioStats = document.querySelector('.portfolio-stats');
    if (portfolioStats) {
        observer.observe(portfolioStats);
    }

    // Typed Initiate with improved configuration
    if ($('.typed-text-output').length == 1) {
        var typed_strings = $('.typed-text').text();
        var typed = new Typed('.typed-text-output', {
            strings: typed_strings.split(', '),
            typeSpeed: 80,
            backSpeed: 40,
            smartBackspace: true,
            loop: true,
            backDelay: 2000,
            cursorChar: '|',
            shuffle: false
        });
    }

    // Smooth scrolling to section with offset for fixed header
    $(".btn-scroll").on('click', function (event) {
        if (this.hash !== "") {
            event.preventDefault();
            
            $('html, body').animate({
                scrollTop: $(this.hash).offset().top - 20
            }, 1500, 'easeInOutExpo');
        }
    });
    
    // Smooth scrolling for all anchor links
    $('a[href^="#"]').on('click', function(event) {
        if (this.hash !== "" && this.hash !== "#") {
            event.preventDefault();
            
            $('html, body').animate({
                scrollTop: $(this.hash).offset().top - 20
            }, 1000, 'easeInOutExpo');
        }
    });
    
    // Skills Progress Bar Animation
    $('.skill').waypoint(function () {
        $('.progress .progress-bar').each(function () {
            $(this).css("width", $(this).attr("aria-valuenow") + '%');
        });
    }, {offset: '80%'});

    // Portfolio isotope and filter
    var portfolioIsotope = $('.portfolio-container').isotope({
        itemSelector: '.portfolio-item',
        layoutMode: 'fitRows',
        filter: '*',
        animationOptions: {
            duration: 750,
            easing: 'linear',
            queue: false
        }
    });
    
    $('#portfolio-flters li').on('click', function () {
        $("#portfolio-flters li").removeClass('active');
        $(this).addClass('active');

        var filterValue = $(this).data('filter');
        portfolioIsotope.isotope({filter: filterValue});
    });

    // Initialize Lightbox
    if (typeof lightbox !== 'undefined') {
        lightbox.option({
            'resizeDuration': 200,
            'wrapAround': true
        });
    }

    // Form Validation and Submission
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    
    // Initialize EmailJS (replace with your actual public key)
    // emailjs.init("YOUR_PUBLIC_KEY"); // You need to replace this with your EmailJS public key
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Basic validation
            if (!name || !email || !subject || !message) {
                showFormMessage('Please fill in all fields', 'danger');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showFormMessage('Please enter a valid email address', 'danger');
                return;
            }
            
            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending...';
            submitBtn.disabled = true;
            
            // Simulate form submission (replace with actual EmailJS or backend integration)
            setTimeout(() => {
                // For demo purposes - you would integrate with EmailJS here
                // emailjs.send('service_id', 'template_id', {
                //     from_name: name,
                //     from_email: email,
                //     subject: subject,
                //     message: message
                // }).then(function(response) {
                //     showFormMessage('Message sent successfully! I\'ll get back to you soon.', 'success');
                //     contactForm.reset();
                // }, function(error) {
                //     showFormMessage('Failed to send message. Please try again.', 'danger');
                // });
                
                showFormMessage('Message sent successfully! I\'ll get back to you soon.', 'success');
                contactForm.reset();
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }
    
    function showFormMessage(message, type) {
        formMessage.className = `alert alert-${type} mt-3`;
        formMessage.textContent = message;
        formMessage.classList.remove('d-none');
        
        setTimeout(() => {
            formMessage.classList.add('d-none');
        }, 5000);
    }

    // Parallax Effect for Profile Image
    $(window).on('scroll', function() {
        var scrolled = $(window).scrollTop();
        $('.mypic').css('transform', 'translateY(' + (scrolled * 0.1) + 'px)');
    });

    // Add Active Class to Navigation based on scroll
    $(window).scroll(function() {
        var scrollDistance = $(window).scrollTop();
        
        $('section').each(function(i) {
            if ($(this).position().top <= scrollDistance + 100) {
                $('.nav-link.active').removeClass('active');
                $('.nav-link').eq(i).addClass('active');
            }
        });
    }).scroll();
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });

    // Lazy Loading for Images
    const images = document.querySelectorAll('img');
    const imageOptions = {
        threshold: 0,
        rootMargin: "0px 0px 50px 0px"
    };
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            }
        });
    }, imageOptions);
    
    images.forEach(img => {
        if (img.dataset.src) {
            imageObserver.observe(img);
        }
    });

    // Add hover effect to skill badges
    $('.skill-icons .badge, .tech-stack .badge, .soft-skills .badge').hover(
        function() {
            $(this).addClass('shadow-lg');
        },
        function() {
            $(this).removeClass('shadow-lg');
        }
    );

    // Timeline Animation
    $('.timeline-item').each(function(index) {
        $(this).css('animation-delay', (index * 0.2) + 's');
    });

    // Portfolio Hover Effects
    $('.portfolio-card').hover(
        function() {
            $(this).find('.portfolio-overlay').fadeIn(300);
        },
        function() {
            $(this).find('.portfolio-overlay').fadeOut(300);
        }
    );

    // Certification Category Accordion Effect
    $('.certification-category').click(function() {
        $(this).find('.certification-list').slideToggle(300);
        $(this).find('.category-title i').toggleClass('fa-rotate-180');
    });

    // Add keyboard navigation
    $(document).keydown(function(e) {
        // Press 'T' to go to top
        if (e.key === 't' || e.key === 'T') {
            $('html, body').animate({scrollTop: 0}, 1000);
        }
        // Press 'D' to toggle dark mode
        if (e.key === 'd' || e.key === 'D') {
            $('#darkModeToggle').click();
        }
    });

    // Service Worker Registration for PWA (Optional)
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/sw.js').then(function(registration) {
                console.log('ServiceWorker registration successful');
            }, function(err) {
                console.log('ServiceWorker registration failed: ', err);
            });
        });
    }

    // Performance optimization - Debounce scroll events
    function debounce(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }
    
    // Optimize scroll events
    var optimizedScroll = debounce(function() {
        // Scroll-based animations here
    }, 250);
    
    window.addEventListener('scroll', optimizedScroll);

})(jQuery);