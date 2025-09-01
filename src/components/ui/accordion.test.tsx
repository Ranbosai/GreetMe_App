import { render, screen } from '@testing-library/react';
import { Accordion } from './accordion'; // Updated to named import

describe('Accordion Component', () => {
  test('renders Accordion', () => {
    render(
      <Accordion type="single" collapsible>
        <AccordionTrigger>Test Title</AccordionTrigger>
        <AccordionContent>Test Content</AccordionContent>
      </Accordion>
    );
    expect(screen.getByText(/Test Title/i)).toBeInTheDocument();
    expect(screen.getByText(/Test Content/i)).toBeInTheDocument();
  });
});
