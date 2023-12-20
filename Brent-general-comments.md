
1. Commit history looks pretty clean - that’s always important.  I haven’t dived in to see that each commit actually does what it says it does, but a sloppy commit history is very noticeable (things like, “debugging”, “fixes”, or “misc” - I’m just trying to remember all the crappy things I did way back when…) - I see one of your commits is just “updates” (that’s the only one that sticks out)

I see the naming of folders prefixed with _ => that typically denotes private variables/methos that should not be accessed.  I would remove the underscores from _components, _context, _helpers, _types

Go through the process of setting up lint - when I'm looking at your code in Webstorm with my existing lint rules, I see a lot of things that stick out: unused variables being the 'sorest thumb'

README.md => for some reason I can't edit it... I'd recommend adding 1. a description of what the app is and does (maybe even include a nice screenshot with some some markdown so that it looks legit), and also INCLUDE setup instructions... my team uses pnpm - looks like I'd need to install next to run your app - cool - I can do a `npm install next` => `next build`

I got to: 
`npm install next`
`next build` fails for me because of some of my local eslint config stuff
![Screenshot 2023-12-14 at 8.45.17 AM.png](..%2F..%2F..%2Fvar%2Ffolders%2Fwt%2F632ckbjn4sv69vb0c80q6m3r0000gn%2FT%2FTemporaryItems%2FNSIRD_screencaptureui_e1uZh6%2FScreenshot%202023-12-14%20at%208.45.17%E2%80%AFAM.png)
