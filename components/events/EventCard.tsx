import Link from 'next/link';
import type { Event } from '@/types/event';

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const eventDate = new Date(event.event_date);
  const currentRsvps = event.rsvp_count || 0;
  const capacity = event.capacity;
  const isNearlyFull = currentRsvps >= capacity * 0.8;
  const isFull = currentRsvps >= capacity;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <Link href={`/events/${event.id}`}>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 overflow-hidden">
        <div className="p-4 sm:p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1 mr-3">
              {event.title}
            </h3>
            {event.event_type && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 flex-shrink-0">
                {event.event_type}
              </span>
            )}
          </div>

          {/* Description */}
          {event.description && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {event.description}
            </p>
          )}

          {/* Event Details */}
          <div className="space-y-2 mb-4">
            {/* Date & Time */}
            <div className="flex items-center text-sm text-gray-600">
              <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>
                {formatDate(eventDate)} at {formatTime(event.start_time)}
                {event.end_time && ` - ${formatTime(event.end_time)}`}
              </span>
            </div>

            {/* Location */}
            <div className="flex items-center text-sm text-gray-600">
              <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="truncate">{event.location}</span>
            </div>

            {/* Capacity */}
            <div className="flex items-center text-sm text-gray-600">
              <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span className={`${
                isFull ? 'text-red-600 font-medium' : 
                isNearlyFull ? 'text-amber-600 font-medium' : ''
              }`}>
                {currentRsvps}/{capacity} spots filled
              </span>
              {isFull && (
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  Full
                </span>
              )}
              {isNearlyFull && !isFull && (
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                  Nearly Full
                </span>
              )}
            </div>
          </div>

          {/* Host Info */}
          {event.host && (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {event.host.avatar_url ? (
                  <img
                    src={event.host.avatar_url}
                    alt={event.host.full_name}
                    className="w-6 h-6 rounded-full mr-2"
                  />
                ) : (
                  <div className="w-6 h-6 bg-gray-300 rounded-full mr-2 flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-600">
                      {event.host.full_name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <span className="text-sm text-gray-600">
                  Hosted by {event.host.full_name}
                </span>
              </div>
            </div>
          )}

          {/* Capacity Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  isFull ? 'bg-red-500' :
                  isNearlyFull ? 'bg-amber-500' : 'bg-blue-500'
                }`}
                style={{ width: `${Math.min((currentRsvps / capacity) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}