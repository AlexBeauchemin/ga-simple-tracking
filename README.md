ga-simple-tracking
==================

Google analytics made easy 

### Simple tracking using only html links

Track an event 
```html
<a href="/newpage" class="trackevent" data-tracking-category="your tracking category" data-tracking-action="your tracking action" data-tracking-label="your tracking label">Link</a>
```
Track a pageview
```html
<a href="/" class="trackpageview" data-tracking-page="home">Link</a>
```

### Dynamic events using javascript
First, create the tracker
```javascript
var tracker = $.Tracker($('body'),{
  account: 'your ga id here'
});
```
Dynamic trackpageview
```javascript
tracker.trackPageView('page');
```

Dynamic trackevent
```javascript
tracker.trackEvent(link, category, action, label, target, callback)
```

Parameters for the trackevent : 
- __link__ : Link to redirect after the tracking
- __category__ : The ga category
- __action__ : The ga action
- __label__ : the ga label
- __target__ : set to '_blank' if you want to open the link in a new window
- __callback__ : you can provide a custom function to execute when the tracking is done
