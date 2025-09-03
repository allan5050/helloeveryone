'use client';

import { useState } from 'react';
import { Calendar, MapPin, Clock, Users, Heart, MessageCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import CalendarButton from '@/components/calendar/CalendarButton';
import { Event, Profile } from '@/types';
import { formatDistanceToNow, format } from 'date-fns';

interface EventCardWithCalendarProps {
  event: Event;
  userRsvpStatus?: 'going' | 'maybe' | 'not_going' | null;
  attendeeCount?: number;
  matchCount?: number;
  onRsvp?: (eventId: string, status: 'going' | 'maybe' | 'not_going') => void;
  className?: string;
}

export default function EventCardWithCalendar({
  event,
  userRsvpStatus,
  attendeeCount = 0,
  matchCount = 0,
  onRsvp,
  className
}: EventCardWithCalendarProps) {
  const [rsvpStatus, setRsvpStatus] = useState(userRsvpStatus);
  const [isRsvping, setIsRsvping] = useState(false);

  const eventDateTime = new Date(`${event.date}T${event.time}`);
  const isUpcoming = eventDateTime > new Date();

  const handleRsvp = async (status: 'going' | 'maybe' | 'not_going') => {
    if (!onRsvp) return;
    
    setIsRsvping(true);
    try {
      await onRsvp(event.id, status);
      setRsvpStatus(status);
    } catch (error) {
      console.error('RSVP error:', error);
    } finally {
      setIsRsvping(false);
    }
  };

  const getRsvpButtonText = (status: 'going' | 'maybe' | 'not_going') => {
    switch (status) {
      case 'going': return rsvpStatus === 'going' ? 'Going ✓' : 'Going';
      case 'maybe': return rsvpStatus === 'maybe' ? 'Maybe ✓' : 'Maybe';
      case 'not_going': return rsvpStatus === 'not_going' ? 'Can\'t Go ✓' : 'Can\'t Go';
    }
  };

  const getRsvpButtonVariant = (status: 'going' | 'maybe' | 'not_going') => {
    if (rsvpStatus === status) {
      return status === 'going' ? 'default' : 'secondary';
    }
    return 'outline';
  };

  return (
    <Card className={`hover:shadow-lg transition-shadow ${className}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold line-clamp-2">
              {event.name}
            </CardTitle>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{format(eventDateTime, 'MMM d, yyyy')}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{format(eventDateTime, 'h:mm a')}</span>
              </div>
            </div>
            {event.location && (
              <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span className="line-clamp-1">{event.location}</span>
              </div>
            )}
          </div>
          
          {/* Event badges */}
          <div className="flex flex-col gap-1">
            {matchCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                <Heart className="h-3 w-3 mr-1 text-red-500" />
                {matchCount} match{matchCount === 1 ? '' : 'es'}
              </Badge>
            )}
            {attendeeCount > 0 && (
              <Badge variant="outline" className="text-xs">
                <Users className="h-3 w-3 mr-1" />
                {attendeeCount}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Event description */}
        {event.description && (
          <p className="text-sm text-muted-foreground line-clamp-3">
            {event.description}
          </p>
        )}

        {/* RSVP buttons */}
        {isUpcoming && (
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant={getRsvpButtonVariant('going')}
              onClick={() => handleRsvp('going')}
              disabled={isRsvping}
              className="flex-1 min-w-0"
            >
              {getRsvpButtonText('going')}
            </Button>
            <Button
              size="sm"
              variant={getRsvpButtonVariant('maybe')}
              onClick={() => handleRsvp('maybe')}
              disabled={isRsvping}
              className="flex-1 min-w-0"
            >
              {getRsvpButtonText('maybe')}
            </Button>
            <Button
              size="sm"
              variant={getRsvpButtonVariant('not_going')}
              onClick={() => handleRsvp('not_going')}
              disabled={isRsvping}
              className="flex-1 min-w-0"
            >
              {getRsvpButtonText('not_going')}
            </Button>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1">
            <MessageCircle className="h-4 w-4 mr-2" />
            Chat
          </Button>
          
          {/* Calendar button - only show if user is going */}
          <CalendarButton
            eventId={event.id}
            eventName={event.name}
            userRsvpStatus={rsvpStatus}
            variant="outline"
            size="sm"
            className="flex-1"
          />
        </div>

        {/* Time indicator */}
        {isUpcoming && (
          <p className="text-xs text-muted-foreground text-center">
            {formatDistanceToNow(eventDateTime, { addSuffix: true })}
          </p>
        )}
      </CardContent>
    </Card>
  );
}