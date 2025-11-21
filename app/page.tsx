import { ParallaxScrollGallery } from "@/components/parallax-scroll-gallery";
import { ScrollBasedVelocityDemo } from "@/components/scroll-based-velocity-demo";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-background">
      <ScrollBasedVelocityDemo />
      
      <ParallaxScrollGallery />

      {/* Additional content */}
      <div className="flex min-h-[50vh] items-center justify-center pb-32">
        <div className="max-w-2xl space-y-8 px-8 text-center">
          <h2 className="text-4xl font-bold tracking-tight">Get In Touch</h2>
          <p className="text-xl text-muted-foreground">
            Feel free to reach out for collaborations or just a friendly chat.
          </p>
          <div className="pt-8">
            <a 
              href="mailto:hello@nicogaspar.com" 
              className="inline-flex h-12 items-center justify-center rounded-full bg-foreground px-8 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
            >
              Contact Me
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}

