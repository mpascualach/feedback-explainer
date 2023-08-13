# Feynman
An interactive platform to help developers teach themselves about blockchain programming

(Note: access the deployed version of this app here: https://main--feynman-gpt.netlify.app/)

## Description

Inspired by the Feynman learning technique - named after a terrific Nobel-prize winning physicist who once learned Spanish in order to prepare for lectures he was due to give in Brazil of all places - this is an app that will let users test themselves on topics in and around blockchain technology. It will also reward them with certifications (which are here minted as NFTs) for having demonstrated an understanding of these topics. The 'courses' themselves will be interactive and powered by ChatGPT.

It is a simple app that is currently still being refined but has a lot of room for expansion beyond its core functionality.

---

This was partly inspired by how full of jargon the web3 space seems to be - and how long it took me personally to get a hang of even the basics. I feel like an app that explains this jargon in ways customisable to the user can really help lower the barrier of entry of developers and other interested parties into it.

## How it's made

The front-end side of the application is powered by NextJS and TailwindCSS. Its main functionality consists of a client that interacts with OpenAI's GPT4 API and either serves up explanations for core blockchain concepts or tests the user's knowledge on them. My app is designed to pick up on explicit queues served up by the API (e.g. messages starting with 'Yes, that's correct!') as a cue to then reward the user with a certification of having understood the concept. It also makes an API call to Dall-E's API to add a background-image to the certification.

Regarding the minting part, it interacts with a simple-enough smart contract deployed onto Mode's Sepolia Network. The only functionality needed for this MVP was one that mints certifications, which currently abides by the ERC721 protocol. I do look forward to expanding this to abide by the ERC1155 protocol instead.

More work involved would entail:
- A lot more user testing.
- Animations.
- Refining the 'test' portion.
- A points-based system that, for example, lets you access more advanced material by completing earlier courses. This will involve quite a bit of planning, though.
- Room for expansion: turning this tool into a pfp project.

I am quite happy with what I put together throughout the week though. It feels like a good starting point.


