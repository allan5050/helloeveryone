'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/app/contexts/AuthContext';
import { getEventById, getEventAttendees, createRSVP, cancelRSVP } from '@/lib/supabase/events';
import type { Event, RSVP } from '@/types/event';

export default function EventDetailsPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [attendees, setAttendees] = useState<RSVP[]>([]);
  const [loading, setLoading] = useState(true);
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadEventDetails();
    }
  }, [id, user?.id]);

  const loadEventDetails = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const [eventData, attendeesData] = await Promise.all([
        getEventById(id as string, user?.id),
        getEventAttendees(id as string)
      ]);
      
      setEvent(eventData);
      setAttendees(attendeesData);
    } catch (err) {
      setError('Failed to load event details');
      console.error('Error loading event details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRSVP = async () => {
    if (!event || !user) return;

    try {
      setRsvpLoading(true);
      const response = await createRSVP(event.id, user.id);
      
      if (response.success) {
        setMessage(response.message);
        // Reload event to get updated RSVP status
        await loadEventDetails();
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('Failed to register for event');
    } finally {
      setRsvpLoading(false);
    }
  };

  const handleCancelRSVP = async () => {
    if (!event || !user) return;

    try {
      setRsvpLoading(true);
      const response = await cancelRSVP(event.id, user.id);
      
      if (response.success) {
        setMessage(response.message);
        // Reload event to get updated RSVP status
        await loadEventDetails();
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('Failed to cancel registration');
    } finally {
      setRsvpLoading(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
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

  // Clear messages after 5 seconds
  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage(null);
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message, error]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-6"></div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <div className="h-8 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-6 w-3/4"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !event) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Event Not Found</h1>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800">{error}</p>
            </div>
            <Link
              href="/events"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Events
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!event) return null;

  const currentRsvps = event.rsvp_count || 0;
  const isEventFull = currentRsvps >= event.capacity;
  const userRsvpStatus = event.user_rsvp?.status;
  const isUserRegistered = userRsvpStatus === 'confirmed' || userRsvpStatus === 'waitlist';

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          href="/events"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Events
        </Link>

        {/* Messages */}
        {message && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-800">{message}</p>
          </div>
        )}

        {error && event && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Event Details */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="p-8 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {event.title}
                  </h1>
                  {event.event_type && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {event.event_type}
                    </span>
                  )}
                </div>

                {/* Host Info */}
                {event.host && (
                  <div className="flex items-center mb-6">
                    {event.host.avatar_url ? (
                      <img
                        src={event.host.avatar_url}
                        alt={event.host.full_name}
                        className="w-10 h-10 rounded-full mr-3"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-300 rounded-full mr-3 flex items-center justify-center">
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {event.host.full_name}
                      </p>
                      <p className="text-sm text-gray-600">Event Host</p>
                    </div>
                  </div>
                )}
              </div>

              {/* RSVP Section */}
              <div className="flex-shrink-0 text-center sm:text-right">
                <div className="mb-4">
                  <div className={`text-2xl font-bold ${
                    isEventFull ? 'text-red-600' : 'text-gray-900'
                  }`}>
                    {currentRsvps}/{event.capacity}
                  </div>
                  <div className="text-sm text-gray-600">
                    {isEventFull ? 'Event Full' : 'Spots Available'}
                  </div>
                </div>

                {user && (
                  <div>
                    {!isUserRegistered ? (
                      <button
                        onClick={handleRSVP}
                        disabled={rsvpLoading}
                        className={`w-full sm:w-auto px-6 py-3 rounded-lg font-medium transition-colors ${
                          rsvpLoading
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : isEventFull
                            ? 'bg-amber-600 hover:bg-amber-700 text-white'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                      >
                        {rsvpLoading ? 'Processing...' : 
                         isEventFull ? 'Join Waitlist' : 'Register for Event'}
                      </button>
                    ) : (
                      <div className="space-y-2">
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                          userRsvpStatus === 'confirmed' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {userRsvpStatus === 'confirmed' ? 'Registered' : 'On Waitlist'}
                        </div>
                        <button
                          onClick={handleCancelRSVP}
                          disabled={rsvpLoading}
                          className="w-full sm:w-auto px-4 py-2 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                        >
                          {rsvpLoading ? 'Cancelling...' : 'Cancel Registration'}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Event Info */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column - Event Details */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Event Details</h2>
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600">
                      <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{formatDate(event.event_date)}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>
                        {formatTime(event.start_time)}
                        {event.end_time && ` - ${formatTime(event.end_time)}`}
                      </span>
                    </div>
                    <div className="flex items-start text-gray-600">
                      <svg className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <div>
                        <div>{event.location}</div>
                        {event.location_details && (
                          <div className="text-sm text-gray-500 mt-1">
                            {event.location_details}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      <span>Maximum {event.capacity} attendees</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {event.description && (
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">About This Event</h2>
                    <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                      {event.description}
                    </p>
                  </div>
                )}
              </div>

              {/* Right Column - Attendees */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Attendees ({attendees.length})
                </h2>
                {attendees.length > 0 ? (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {attendees.map(attendee => (
                      <div key={attendee.id} className="flex items-center">
                        {attendee.user?.avatar_url ? (
                          <img
                            src={attendee.user.avatar_url}
                            alt={attendee.user.full_name}
                            className="w-8 h-8 rounded-full mr-3"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-gray-300 rounded-full mr-3 flex items-center justify-center">
                            <span className="text-xs font-medium text-gray-600">
                              {attendee.user?.full_name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <span className="text-sm text-gray-900">
                          {attendee.user?.full_name}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <p>No attendees yet</p>
                    <p className="text-sm">Be the first to register!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}