<template>
    <footer class="footer">
        <div class="footer-body">
            <div class="footer-columns">
                <div class="footer-column">
                    <div class="title">About Us</div>
                    <ul>
                        <li><a href="/about">Our Story</a></li>
                        <li><a href="/team">Meet the Team</a></li>
                        <li><a href="/blog">Documentation</a></li>
                    </ul>
                </div>
                <div class="footer-column">
                    <div class="title">Customer Service</div>
                    <ul>
                        <li><a href="/faq">FAQ</a></li>
                        <li><a href="/support">Support</a></li>
                        <li><a href="/returns">Returns</a></li>
                    </ul>
                </div>
                <div class="footer-column">

                    <div class="title">Contact Us</div>
                    <ul>
                        <li>sudo.delete.evil@gmail.com</li>
                    </ul>
                </div>
                <div class="footer-column">
                    <div class="title">Follow Us</div>
                    <ul class="social-links">
                        <li><a href="#">YouTube</a></li>
                        <li><a href="#">GitHub</a></li>
                        <li><a href="#">X</a></li>
                    </ul>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2025. Cardano Open Source Community.</p>
                <div class="payment-icons">

                </div>
            </div>
        </div>
    </footer>
</template>

<script setup>

</script>

<style lang="css" scoped>
.footer {
    padding: 4rem 1rem;
    margin-top: 4rem;
    font-size: var(--text-size-1);
    background: var(--background-a);
}

.title {
    font-size: var(--text-size-2);
    font-weight: 700;
    line-height: 3rem;
}

.footer-body {
    max-width: 1300px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

.footer-columns {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 2rem;
}

.footer-column {
    flex: 1;
    min-width: 200px;
}

.footer-column ul {
    list-style: none;
    padding: 0;
}

.footer-column ul li {
    margin-bottom: 0.5rem;
    color: var(--text-b);
}

.footer-column ul li a {
    text-decoration: none;
    transition: color 0.3s ease;
}

.social-links li {
    display: flex;
    align-items: center;
}

.social-links li a {
    display: flex;
    align-items: center;
}

.footer-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
    border-top: 1px solid var(--border-a);
    padding-top: 1rem;
    color: var(--text-b);
}

@media (max-width: 768px) {
    .footer-columns {
        flex-direction: column;
    }

    .footer-bottom {
        flex-direction: column;
    }
}
</style>