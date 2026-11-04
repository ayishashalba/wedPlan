import React from 'react';
import { CalendarHeart, SearchX, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const EmptyState = ({
  icon: Icon = SearchX,
  title = 'No records found',
  description = 'Try adjusting your filters or search terms to find what you are looking for.',
  actionLabel,
  actionLink,
  onAction
}) => {
  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 p-12 text-center max-w-md mx-auto my-8 shadow-sm">
      <div className="w-16 h-16 mx-auto mb-4 bg-wed-cream rounded-2xl flex items-center justify-center text-wed-gold border border-wed-gold/30">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold font-serif text-wed-brown mb-2">{title}</h3>
      <p className="text-sm text-wed-brown-muted leading-relaxed mb-6">{description}</p>
      {actionLabel && actionLink && (
        <Link
          to={actionLink}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-wed-gold text-white font-medium rounded-xl hover:bg-wed-gold-dark transition shadow-sm"
        >
          <PlusCircle className="w-4 h-4" />
          {actionLabel}
        </Link>
      )}
      {actionLabel && onAction && !actionLink && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-wed-gold text-white font-medium rounded-xl hover:bg-wed-gold-dark transition shadow-sm"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;

