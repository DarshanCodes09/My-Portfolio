'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useUmami } from '@/hooks/use-umami';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowUpRight, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const contactFormSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  message: z
    .string()
    .min(10, {
      message: 'Message must be at least 10 characters.',
    })
    .max(1000, {
      message: 'Message must not exceed 1000 characters.',
    }),
  website: z.string().max(0).optional(),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

type ContactFormProps = {
  variant?: 'default' | 'embedded';
};

export default function ContactForm({ variant = 'default' }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { trackEvent } = useUmami();
  const embedded = variant === 'embedded';

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
      website: '',
    },
  });

  const fieldClass = cn(
    'h-11 rounded-lg px-4 text-[14px] transition-colors',
    embedded
      ? 'border-zinc-200 bg-zinc-50 text-zinc-900 placeholder:text-zinc-400 focus-visible:border-zinc-300 focus-visible:ring-zinc-300/30 dark:border-zinc-800 dark:bg-zinc-950/50 dark:text-zinc-100 dark:placeholder:text-zinc-600 dark:focus-visible:border-zinc-700'
      : 'border-zinc-200 bg-white text-zinc-900 placeholder:text-zinc-400 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-100 dark:placeholder:text-neutral-600',
  );

  const textareaClass = cn(
    'min-h-[120px] resize-none rounded-lg p-4 text-[14px] transition-colors',
    embedded
      ? 'border-zinc-200 bg-zinc-50 text-zinc-900 placeholder:text-zinc-400 focus-visible:border-zinc-300 focus-visible:ring-zinc-300/30 dark:border-zinc-800 dark:bg-zinc-950/50 dark:text-zinc-100 dark:placeholder:text-zinc-600 dark:focus-visible:border-zinc-700'
      : 'border-zinc-200 bg-white text-zinc-900 placeholder:text-zinc-400 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-100 dark:placeholder:text-neutral-600',
  );

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const contentType = response.headers.get('content-type') ?? '';
      let result: { message?: string; error?: string; success?: boolean } = {};

      if (contentType.includes('application/json')) {
        result = await response.json();
      } else {
        const text = await response.text();
        console.error('[contact] Non-JSON response:', text.slice(0, 200));
        throw new Error(
          'Server returned an invalid response. Please try again.',
        );
      }

      trackEvent({
        name: 'form_submit',
        data: { formId: 'contact', success: response.ok },
      });

      if (response.ok) {
        toast.success(result.message || 'Message sent successfully!');
        form.reset();
      } else {
        trackEvent({
          name: 'form_error',
          data: { formId: 'contact', errorType: 'request_failed' },
        });
        toast.error(
          result.error || 'Failed to send message. Please try again.',
        );
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      trackEvent({
        name: 'form_submit',
        data: { formId: 'contact', success: false },
      });
      trackEvent({
        name: 'form_error',
        data: { formId: 'contact', errorType: 'network_error' },
      });
      toast.error(
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again later.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem className="absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0">
              <FormControl>
                <Input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Full Name"
                  className={fieldClass}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Email Address"
                  type="email"
                  className={fieldClass}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Your Message"
                  className={textareaClass}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className={cn(
            'group mt-4 h-11 w-full rounded-lg border text-[14px] font-semibold transition-colors',
            embedded
              ? 'border-zinc-200 bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800'
              : 'border-zinc-200 bg-zinc-900 text-white hover:bg-zinc-800 dark:border-white/10 dark:bg-white/[0.03] dark:text-neutral-200 dark:hover:bg-white/[0.07]',
          )}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              Send Message
              <ArrowUpRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
