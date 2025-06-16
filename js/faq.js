
// FAQ page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    setupFAQAccordion();
});

function setupFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active', !isActive);
            
            // Add smooth scroll to active item
            if (!isActive) {
                setTimeout(() => {
                    item.scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest'
                    });
                }, 100);
            }
        });
    });
}

// Search FAQ functionality (if you want to add a search feature)
function searchFAQ(query) {
    const faqItems = document.querySelectorAll('.faq-item');
    const searchQuery = query.toLowerCase();
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question h3').textContent.toLowerCase();
        const answer = item.querySelector('.faq-answer p').textContent.toLowerCase();
        
        const matches = question.includes(searchQuery) || answer.includes(searchQuery);
        
        item.style.display = matches ? 'block' : 'none';
        
        // Highlight search terms if matches
        if (matches && searchQuery.length > 2) {
            highlightSearchTerm(item, searchQuery);
        }
    });
}

function highlightSearchTerm(element, term) {
    // Remove previous highlights
    const highlighted = element.querySelectorAll('.highlight');
    highlighted.forEach(el => {
        el.outerHTML = el.innerHTML;
    });
    
    // Add new highlights
    const walker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );
    
    const textNodes = [];
    let node;
    
    while (node = walker.nextNode()) {
        textNodes.push(node);
    }
    
    textNodes.forEach(textNode => {
        const text = textNode.textContent;
        const regex = new RegExp(`(${term})`, 'gi');
        
        if (regex.test(text)) {
            const highlightedText = text.replace(regex, '<span class="highlight">$1</span>');
            const wrapper = document.createElement('span');
            wrapper.innerHTML = highlightedText;
            textNode.parentNode.replaceChild(wrapper, textNode);
        }
    });
}

// Add search functionality to page if search input exists
function addFAQSearch() {
    const faqContainer = document.querySelector('.faq-container');
    if (!faqContainer) return;
    
    const searchHTML = `
        <div class="faq-search" style="margin-bottom: 2rem;">
            <input type="text" placeholder="Search FAQ..." class="search-input" 
                   style="width: 100%; padding: 1rem; border: 2px solid #e0e0e0; border-radius: var(--border-radius); font-size: 1rem;">
        </div>
    `;
    
    faqContainer.insertAdjacentHTML('beforebegin', searchHTML);
    
    const searchInput = document.querySelector('.search-input');
    searchInput.addEventListener('input', function() {
        const query = this.value;
        if (query.length === 0) {
            // Show all items if search is empty
            document.querySelectorAll('.faq-item').forEach(item => {
                item.style.display = 'block';
            });
        } else {
            searchFAQ(query);
        }
    });
}

// Add CSS for highlight effect
const style = document.createElement('style');
style.textContent = `
    .highlight {
        background-color: yellow;
        font-weight: bold;
        padding: 0 2px;
        border-radius: 2px;
    }
    
    .faq-search {
        position: relative;
    }
    
    .faq-search::after {
        content: '🔍';
        position: absolute;
        right: 1rem;
        top: 50%;
        transform: translateY(-50%);
        pointer-events: none;
        opacity: 0.5;
    }
    
    .search-input:focus {
        outline: none;
        border-color: var(--primary-color);
        box-shadow: 0 0 0 3px rgba(44, 94, 46, 0.1);
    }
`;
document.head.appendChild(style);

// Initialize search if needed
// addFAQSearch();
