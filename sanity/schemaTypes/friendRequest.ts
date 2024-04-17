import { defineField, defineType } from 'sanity';

export const friendRequest = defineType({
  name: 'friendRequest',
  title: 'Friend Request',
  type: 'document',
  fields: [
    defineField({
      name: 'from',
      title: 'From',
      type: 'reference',
      to: [{ type: 'user' }],
    }),
    defineField({
      name: 'to',
      title: 'To',
      type: 'reference',
      to: [{ type: 'user' }],
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Pending', value: 'pending' },
          { title: 'Accepted', value: 'accepted' },
          { title: 'Rejected', value: 'rejected' },
        ],
      },
      initialValue: 'pending',
    }),
  ],
});
