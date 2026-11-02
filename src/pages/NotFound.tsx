import { motion } from 'motion/react';
import { Button, EASE } from '../components/ui';

export default function NotFound() {
  return (
    <section className="flex min-h-[80vh] flex-col items-center justify-center px-4 pt-24 text-center">
      <motion.p initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1, ease: EASE }} className="text-[28vw] font-semibold leading-none tracking-[-0.08em] text-sand md:text-[18vw]">
        404
      </motion.p>
      <h1 className="-mt-4 text-3xl font-medium md:text-5xl">This room hasn’t been designed yet.</h1>
      <p className="mt-3 text-muted">The page you’re looking for doesn’t exist or has moved.</p>
      <div className="mt-8 flex gap-3">
        <Button to="/">Back home</Button>
        <Button to="/shop" variant="outline">
          Visit the shop
        </Button>
      </div>
    </section>
  );
}
