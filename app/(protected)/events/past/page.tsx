'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/contexts/AuthContext';
import { getPastEvents } from '@/lib/supabase/events';
import type { Event } from '@/types/event';

function PastEventCard({ event }: { event: Event }) {
  const eventDate = new Date(event.event_date);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
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
    <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-700 line-clamp-2 flex-1 mr-3">
            {event.title}
          </h3>
          <div className="flex flex-col items-end gap-1">
            {event.event_type && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-700">
                {event.event_type}
              </span>
            )}
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Attended
            </span>
          </div>
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
            </span>
          </div>

          {/* Final Attendance */}
          <div className="flex items-center text-sm text-gray-600">
            <span className="font-medium">Final attendance:</span>
            <span className="ml-2">{event.rsvp_count || 0}/{event.capacity} people</span>
          </div>
        </div>

        {/* Host Info */}
        {event.host && (
          <div className="flex items-center">
            {event.host.avatar_url ? (
              <img
                src={event.host.avatar_url}
                alt={event.host.full_name}
                className="w-6 h-6 rounded-full mr-2 opacity-75"
              />
            ) : (
              <div className="w-6 h-6 bg-gray-300 rounded-full mr-2 flex items-center justify-center opacity-75">
                <span className="text-xs font-medium text-gray-600">
                  {event.host.full_name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <span className="text-sm text-gray-600">
              Hosted by {event.host.full_name}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PastEventsPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadPastEvents();
    }
  }, [user]);

  const loadPastEvents = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const pastEvents = await getPastEvents(user.id);
      setEvents(pastEvents);
    } catch (err) {
      setError('Failed to load past events');
      console.error('Error loading past events:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Past Events</h1>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">{error}</p>
              <button 
                onClick={loadPastEvents}
                className="mt-2 text-red-600 hover:text-red-800 underline"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Past Events</h1>
            <p className="text-gray-600">
              Events you've attended in the past
            </p>
          </div>
          <Link
            href="/events"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            View Upcoming Events
          </Link>
        </div>

        {/* Events List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-50 rounded-lg border border-gray-200 p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-3"></div>
                <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : events.length > 0 ? (
          <>
            <div className="mb-6 text-sm text-gray-600">
              You attended {events.length} event{events.length !== 1 ? 's' : ''}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map(event => (
                <PastEventCard key={event.id} event={event} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No past events</h3>
            <p className="text-gray-600 mb-6">
              You haven't attended any events yet. Join some upcoming events to get started!
            </p>
            <Link
              href="/events"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Browse Upcoming Events
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}