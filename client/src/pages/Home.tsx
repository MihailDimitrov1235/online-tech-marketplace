import { Button } from "../components/Button";

export default function Home() {
  return (  
  <div className="relative isolate px-6 pt-14 lg:px-8">
    <div className="mx-auto max-w-3xl py-32 sm:py-48 lg:py-56">
      <div className="text-center">
        <h1 className="text-6xl font-semibold tracking-tight text-balance text-contrast sm:text-7xl">Build anything you need with the right tools</h1>
        <p className="mt-8 text-lg font-medium text-pretty text-contrast/60 sm:text-xl/8">Browse thousands of tools and hardware essentials with expert guidance and fast delivery straight to your door</p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button>Products</Button>
            <Button variant="ghost">Learn more <span aria-hidden="true">→</span></Button>
        </div>
      </div>
    </div>
  </div>
  )
}
