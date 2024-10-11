import EventTable from './EventTable'

export default function EventsPage() {
  return (
    <main className='flex flex-col items-center'>
      <h1 className='text-5xl mb-8'>Run Clubber Events</h1>
      <EventTable />
    </main>
  )
}
