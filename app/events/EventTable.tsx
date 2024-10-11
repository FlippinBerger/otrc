'use client'

import React, { useEffect, useState } from 'react'

import eventsJson from '../../public/files/events.json'

type ClubEvent = {
  name: string
  imgUrl?: string
  link?: string
  time: string
  clubDetails?: string
  type: string
}

const EventTable = () => {
  const [upcoming, setUpcoming] = useState(false)
  const [past, setPast] = useState(false)
  const [run, setRun] = useState(false)
  const [hang, setHang] = useState(false)
  const [events, setEvents] = useState<ClubEvent[]>([])

  const [showFilters, setShowFilters] = useState(true)

  useEffect(() => {
    setEvents(eventsJson.events)
  }, [])

  const HANG = 'hang'
  const RUN = 'run'

  const filterEvents = () => {
    const now = new Date()
    const filteredEvents = eventsJson.events.filter((event) => {
      const eventDate = new Date(event.time)

      if (upcoming && !past) {
        if (run && !hang) {
          return event.type == RUN && eventDate >= now
        } else if (hang && !run) {
          return event.type == HANG && eventDate >= now
        } else {
          return (event.type == RUN || event.type == HANG) && eventDate >= now
        }
      } else if (past && !upcoming) {
        if (run && !hang) {
          return event.type == RUN && eventDate < now
        } else if (hang && !run) {
          return event.type == HANG && eventDate < now
        } else {
          return (event.type == RUN || event.type == HANG) && eventDate < now
        }
      } else {
        if (run && !hang) {
          return event.type == RUN
        } else if (hang && !run) {
          return event.type == HANG
        } else {
          return event.type == RUN || event.type == HANG
        }
      }
    })

    setEvents(filteredEvents)
  }

  return (
    <div className='w-full flex flex-col items-center'>
      {showFilters && (
        <div className='flex gap-2 mb-4'>
          <FilterButton
            name='Upcoming'
            selected={upcoming}
            onClick={() => setUpcoming((old) => !old)}
          />
          <FilterButton
            name='Past'
            selected={past}
            onClick={() => setPast((old) => !old)}
          />
          <FilterButton
            name='Run'
            selected={run}
            onClick={() => setRun((old) => !old)}
          />
          <FilterButton
            name='Hang'
            selected={hang}
            onClick={() => setHang((old) => !old)}
          />
          <FilterButton name='Apply Filters' onClick={() => filterEvents()} />
        </div>
      )}
      <button onClick={() => setShowFilters((old) => !old)}>
        {showFilters ? 'Hide Filters' : 'Show Filters'}
      </button>
      {events.length > 0 ? (
        <ul className='mt-8 flex flex-col w-screen items-center'>
          {events.map((event) => {
            return <EventCard key={event.name} event={event} />
          })}
        </ul>
      ) : (
        <h1 className='mt-8 text-2xl'>There are no events</h1>
      )}
    </div>
  )
}

interface EventCardProps {
  event: ClubEvent
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const eventTime = new Date(event.time)
  return (
    <li className='w-2/3 text-center'>
      <a href={event.link} target='_blank'>
        <div className='p-4 border border-white rounded-lg bg-blue-900 shadow'>
          {/*event.imgUrl && (
            <Image
              src={event.imgUrl}
              alt={`image of event ${event.name}`}
              width={200}
              height={200}
            />
          )*/}
          <h1 className='text-2xl md:text-3xl'>{event.name}</h1>
          <h1 className='text-xl md:text-2xl'>{eventTime.toLocaleString()}</h1>
          {event.clubDetails && (
            <h3 className='mt-4 pt-4 border-t text-lg text-left'>
              {event.clubDetails}
            </h3>
          )}
        </div>
      </a>
    </li>
  )
}

export default EventTable

interface FilterButtonProps {
  name: string
  selected?: boolean
  onClick: () => void
}
const FilterButton: React.FC<FilterButtonProps> = ({
  name,
  selected,
  onClick,
}) => {
  return (
    <button
      className={`border p-1 rounded ${selected && 'bg-blue-500'}`}
      onClick={onClick}
    >
      {name}
    </button>
  )
}
