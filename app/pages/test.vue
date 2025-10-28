<template>
    <div class="text-foreground">
  
  
      <!-- Hero Section -->
      <HeroSection2 />
  
      <!-- Logo Section -->
      <LogoSection10 />
  
      <!-- Features Section -->
      <section id="features" class="py-20 md:py-32">
        <div class="container mx-auto px-4">
          <div class="text-center mb-16">
            <h2 class="text-3xl md:text-5xl font-bold mb-4">
              Everything you need to succeed
            </h2>
            <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to help your team work smarter, not harder.
            </p>
          </div>
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div
              v-for="feature in features"
              :key="feature.title"
              class="p-6 rounded-lg border border-border hover:border-primary/50 transition-colors"
            >
              <div class="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <span class="text-2xl">{{ feature.icon }}</span>
              </div>
              <h3 class="text-xl font-semibold mb-2">{{ feature.title }}</h3>
              <p class="text-muted-foreground">{{ feature.description }}</p>
            </div>
          </div>
        </div>
      </section>
  
      <!-- Pricing Section -->
      <section id="pricing" class="py-20 md:py-32 bg-muted/30">
        <div class="container mx-auto px-4">
          <div class="text-center mb-16">
            <h2 class="text-3xl md:text-5xl font-bold mb-4">
              Simple, transparent pricing
            </h2>
            <p class="text-lg text-muted-foreground">
              Choose the plan that's right for your team
            </p>
          </div>
          <div class="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div
              v-for="plan in pricingPlans"
              :key="plan.name"
              class="p-8 rounded-lg border border-border bg-background hover:border-primary/50 transition-colors"
              :class="{ 'ring-2 ring-primary': plan.popular }"
            >
              <div v-if="plan.popular" class="text-xs font-semibold text-primary mb-4">
                MOST POPULAR
              </div>
              <h3 class="text-2xl font-bold mb-2">{{ plan.name }}</h3>
              <div class="mb-6">
                <span class="text-4xl font-bold">${{ plan.price }}</span>
                <span class="text-muted-foreground">/month</span>
              </div>
              <ul class="space-y-3 mb-8">
                <li v-for="feature in plan.features" :key="feature" class="flex items-start gap-2">
                  <span class="text-primary mt-1">✓</span>
                  <span class="text-sm">{{ feature }}</span>
                </li>
              </ul>
              <button
                class="w-full py-3 rounded-lg font-medium transition-colors"
                :class="plan.popular 
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                  : 'border border-border hover:bg-accent'"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </section>
  
      <!-- CTA Section -->
      <section class="py-20 md:py-32">
        <div class="container mx-auto px-4">
          <div class="max-w-3xl mx-auto text-center">
            <h2 class="text-3xl md:text-5xl font-bold mb-6">
              Ready to transform your workflow?
            </h2>
            <p class="text-lg text-muted-foreground mb-8">
              Join thousands of teams already using MindSpace to achieve their goals.
            </p>
            <button class="px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium text-lg">
              Start Your Free Trial
            </button>
          </div>
        </div>
      </section>
  
      <!-- Footer -->
      <footer class="border-t border-border py-12">
        <div class="container mx-auto px-4">
          <div class="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div class="flex items-center gap-2 mb-4">
                <div class="h-8 w-8 rounded-lg bg-primary"></div>
                <span class="text-xl font-bold">MindSpace</span>
              </div>
              <p class="text-sm text-muted-foreground">
                Empowering teams to achieve more together.
              </p>
            </div>
            <div>
              <h4 class="font-semibold mb-4">Product</h4>
              <ul class="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" class="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#" class="hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="#" class="hover:text-foreground transition-colors">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 class="font-semibold mb-4">Company</h4>
              <ul class="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" class="hover:text-foreground transition-colors">About</a></li>
                <li><a href="#" class="hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#" class="hover:text-foreground transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 class="font-semibold mb-4">Legal</h4>
              <ul class="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" class="hover:text-foreground transition-colors">Privacy</a></li>
                <li><a href="#" class="hover:text-foreground transition-colors">Terms</a></li>
                <li><a href="#" class="hover:text-foreground transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div class="pt-8 border-t border-border text-center text-sm text-muted-foreground">
            © 2025 MindSpace. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import HeroSection2 from '~/components/HeroSection2.vue'
  import LogoSection10 from '~/components/LogoSection10.vue'
  
  
  const features = ref([
    {
      icon: '🚀',
      title: 'Lightning Fast',
      description: 'Optimized performance ensures your team never waits. Experience instant loading and seamless interactions.'
    },
    {
      icon: '🔒',
      title: 'Secure by Default',
      description: 'Enterprise-grade security with end-to-end encryption. Your data is always protected and private.'
    },
    {
      icon: '🤝',
      title: 'Team Collaboration',
      description: 'Work together in real-time with powerful collaboration tools designed for modern teams.'
    },
    {
      icon: '📊',
      title: 'Advanced Analytics',
      description: 'Get insights into your workflow with detailed analytics and customizable reports.'
    },
    {
      icon: '🔄',
      title: 'Seamless Integration',
      description: 'Connect with your favorite tools and services. Works with everything you already use.'
    },
    {
      icon: '🎨',
      title: 'Customizable',
      description: 'Tailor the platform to your needs with flexible customization options and themes.'
    }
  ])
  
  const pricingPlans = ref([
    {
      name: 'Starter',
      price: 9,
      popular: false,
      features: [
        'Up to 5 team members',
        '10 GB storage',
        'Basic analytics',
        'Email support',
        'Mobile app access'
      ]
    },
    {
      name: 'Professional',
      price: 29,
      popular: true,
      features: [
        'Up to 20 team members',
        '100 GB storage',
        'Advanced analytics',
        'Priority support',
        'Custom integrations',
        'API access'
      ]
    },
    {
      name: 'Enterprise',
      price: 99,
      popular: false,
      features: [
        'Unlimited team members',
        'Unlimited storage',
        'Custom analytics',
        '24/7 dedicated support',
        'Advanced security',
        'Custom contracts'
      ]
    }
  ])
  </script>
  
  <style scoped>
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --border: 214.3 31.8% 91.4%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --accent: 210 40% 96.1%;
  }
  
  .bg-background {
    background-color: hsl(var(--background));
  }
  
  .text-foreground {
    color: hsl(var(--foreground));
  }
  
  .bg-muted\/30 {
    background-color: hsl(var(--muted) / 0.3);
  }
  
  .text-muted-foreground {
    color: hsl(var(--muted-foreground));
  }
  
  .border-border {
    border-color: hsl(var(--border));
  }
  
  .bg-primary {
    background-color: hsl(var(--primary));
  }
  
  .text-primary {
    color: hsl(var(--primary));
  }
  
  .text-primary-foreground {
    color: hsl(var(--primary-foreground));
  }
  
  .bg-primary\/10 {
    background-color: hsl(var(--primary) / 0.1);
  }
  
  .hover\:bg-accent:hover {
    background-color: hsl(var(--accent));
  }
  
  .hover\:bg-primary\/90:hover {
    background-color: hsl(var(--primary) / 0.9);
  }
  
  .hover\:border-primary\/50:hover {
    border-color: hsl(var(--primary) / 0.5);
  }
  
  .ring-primary {
    --tw-ring-color: hsl(var(--primary));
  }
  </style>