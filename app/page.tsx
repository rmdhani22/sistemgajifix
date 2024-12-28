// src/app/page.tsx
import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/login');
  return null; // Return null since the component won't render anything
}
