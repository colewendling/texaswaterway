import type { StructureResolver } from 'sanity/structure';

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.documentTypeListItem('user').title('Users'),
      S.documentTypeListItem('event').title('Events'),
      S.documentTypeListItem('playlist').title('Playlists'),
      S.documentTypeListItem('friendRequest').title('Friend Requests'),
    ]);
