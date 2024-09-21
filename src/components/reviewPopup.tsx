import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface ReviewPopupProps {
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;  // Ensure correct type for form submission
  review: { rating: number; comment: string };
  onReviewChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const ReviewPopup: React.FC<ReviewPopupProps> = ({ onClose, onSubmit, review, onReviewChange }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-[#e8e0d4] p-6 rounded-lg shadow-lg w-11/12 max-w-lg">
        <h2 className="text-xl font-semibold mb-4">Leave a Review</h2>
        <form onSubmit={onSubmit}>  {/* Wrap the form elements in a form */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Rating</label>
            <Input
              type="number"
              name="rating"
              value={review.rating}
              min="0"
              max="5"
              step="0.5"
              onChange={onReviewChange}
              className="border rounded-lg w-full p-2"
              required  // Add validation
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Comment</label>
            <Textarea
              name="comment"
              value={review.comment}
              onChange={onReviewChange}
              className="border rounded-lg w-full p-2"
              rows={4}
              required  // Add validation
            />
          </div>
          <div className="flex justify-end gap-4">
            <Button
              type="submit"  // Set to submit the form
              className="bg-[#4d3d30] text-[#e8e0d4] px-6 py-3 rounded-lg text-lg font-semibold hover:bg-[#3b2a1e]"
            >
              Submit Review
            </Button>
            <Button
              type="button"  // Set this button as type button to avoid submitting
              onClick={onClose}
              className="bg-[#4d3d30] text-[#e8e0d4] px-6 py-3 rounded-lg text-lg font-semibold hover:bg-[#3b2a1e]"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewPopup;
