# Admin Dashboard

<img src="https://github.com/yilverdeja/caregiver-admin-dashboard/assets/29952939/ab9b6e5f-5f28-461e-856b-d9a9651cd6a3" alt="desktop-showcase" width="auto" height="400">
<img src="https://github.com/yilverdeja/caregiver-admin-dashboard/assets/29952939/29b52ebb-153e-476b-bf6d-2538d43eeace" alt="desktop-showcase" width="auto" height="400">

## About

This is a mock admin panel for admins to approve or decline caregiver shifts. The major features are:

1. Shift Listing
2. Shift Management
3. Shift Search by Caregiver

### Specifications

#### Shift Listing

-   Displays all the shifts and groups them by their month and date
-   Supports horizontal scrolling if there are more than 3 months

#### Shift Management

-   Admins can decline or confirm shifts only if the status is PENDING. Therefore, once a shift is DECLINED or CONFIRMED, it cannot be changed again
-   Supports multiple selection for confirming multiple shifts

#### Shift Search

-   Searching by a caregivers name will display only the shifts that match that caregivers name
-   Search is performed immediately when the name is typed
-   Search bar is located at the top and remains at the position even when the shifts view is scrolling

### Built With

#### Frontend

-   Typescript
-   React
-   Zustand: State Management
-   TailwindCSS: UI

#### Backend

-   Typescript
-   Node
-   Express

## Getting Started

### Note

This project has only been tested on Node Version `20.11.0`. Please consider using Node Version `20.11.0` if it doesn't work on previous versions.

### Installation

On the root folder, install all the NPM packages with the following command.

```sh
npm run install
```

This will install the NPM packages on the root directory, the frontend directory and the backend directory.

## Scripts

After installing the NPM packages, to run a local

### Server + Client

In the project directory, you can run both the server and client concurrently using:

```sh
npm start
```

This will start a node server on port `5001`, and a web server on an availale port.

### Server

In the backend directory, run the node server using:

```sh
npm start
```

This will start a node server on port `5001`

### Client

In the frontend directory, run the web server using:

```sh
npm run dev
```

This will start a web server on an availale port

## Layout

### Backend

### Frontend

## Known Issues

### Hardcoded Shift Release Component

The shift data is based in 2023, whereas the year of developing this application is in 2024. The `ShiftRelease` component will only appear when the shift status is PENDING and there are less than 24 hours until the shift starts.

For development purposes, the current date was hardcoded in the `ShiftRelease.tsx` Component to March 19th at 1:01PM in the following line:

```tsx
const now = new Date('March 19 2023 13:01');
```

### Horizontal Scrolling with 3 Months

Ideally, horizontal scrolling would only appear on the desktop view if there were more than 3 shift month views. However, even with only 3 shift month views available, there is still a bit of horizontal scrolling.

## Future Improvements

### Confirmation / Alert Modal

To better the user experience, it would be great to add a confirmation dialog to show the user all the shifts that were confirmed after selecting "Confirm" for all the selected shifts.

In addition, if there are any errors during updates, it would also be good to add an alert to show the admins why the update status function did not work.

### Filter by Pending (or Status Type)

Admins can view all the shifts, however, they can only change the statuses of shifts that are PENDING. Therefore, adding a filter to only retrieve shifts with a PENDING status will help clean up the view if necessary.

In addition, a filter by other statuses like "CONFIRMED" or "DECLINED" can be good too and give more control to the admins.

### Scroll Suggestion

On tablets and desktops, a scroll suggestion should be added to show that the content can be scrolled horizontally or vertically to show more information.

The only way the user can know to scroll in this current application is by seeing the scrollbars, or by noticing the cut off views and playing with the screen.
