function Event() {
	this.EventDelegate = new Array()
}
Event.prototype.Add = function(a, b) {
	this.EventDelegate.push([ a, b ])
};
Event.prototype.Remove = function(a) {
	for ( var b = 0; b < this.EventDelegate.length; ++b) {
		if (this.EventDelegate[b][0] == a) {
			this.EventDelegate.splice(b, 1);
			break
		}
	}
};
Event.prototype.Clear = function() {
	this.EventDelegate = new Array()
};
Event.prototype.Dispatch = function() {
	var a = arguments;
	for ( var b = 0; b < this.EventDelegate.length; ++b) {
		this.EventDelegate[b][0].apply(this.EventDelegate[b][1], a)
	}
};
function String(a) {
	this.mString = a ? a : ""
}
String.prototype.At = function(a) {
	return this.mString.charAt(a)
};
String.prototype.CompareTo = function(b) {
	var a = this.mString == b;
	if (a == false) {
		if (this.mString.length > b.mString.length) {
			return 1
		} else {
			return -1
		}
	}
	return 0
};
String.prototype.EndIndexOf = function(b, a) {
	return this.mString.lastIndexOf(b, a)
};
String.prototype.EndsWith = function(a) {
	return (this.mString.indexOf(a, this.mString.length - a.mString.length) != -1)
};
String.prototype.Equals = function(a) {
	return (this.mString == a.mString)
};
String.prototype.IndexOf = function(b, a) {
	return this.mString.indexOf(b, a)
};
String.prototype.Insert = function(b, a) {
	this.mString = this.mString.substring(0, b) + a + this.mString.substring(b);
	return this
};
String.prototype.Length = function() {
	return this.mString.length
};
String.prototype.Remove = function(b, a) {
	this.mString = this.mString.substring(0, b) + this.mString.substring(b + a);
	return this
};
String.prototype.Replace = function(b, a) {
	this.mString = this.mString.replace(new RegExp(b, "g"), a);
	return this
};
String.prototype.Reverse = function() {
	var b = "";
	for ( var a = this.mString.length - 1; a >= 0; ++a) {
		b += this.mString[a]
	}
	this.mString = b;
	return this
};
String.prototype.Split = function(b, a) {
	return this.mString.split(b, a)
};
String.prototype.StartsWith = function(a) {
	return (this.mString.indexOf(a) == 0)
};
String.prototype.Substring = function(b, a) {
	return this.mString.substring(b, b + a)
};
String.prototype.ToByteArray = function() {
	return this.mString
};
String.prototype.ToLower = function() {
	this.mString = this.mString.toLowerCase();
	return this
};
String.prototype.ToUpper = function() {
	this.mString = this.mString.toUpperCase();
	return this
};
String.prototype.Trim = function(a) {
	this.TrimEnd(a);
	this.TrimStart(a);
	return this
};
String.prototype.TrimEnd = function(a) {
	var d = this.mString.length;
	var f = a.length;
	for ( var e = (this.mString.length - f); e >= 0; e -= f) {
		var c = true;
		for ( var b = 0; b < f; ++b) {
			if (this.mString[e + b] != a[b]) {
				c = false;
				break
			}
		}
		if (c) {
			d = e
		} else {
			break
		}
	}
	if (d != this.mString.length) {
		this.mString = this.mString.substring(0, d)
	}
	return this
};
String.prototype.TrimStart = function(a) {
	var d = 0;
	var f = a.length;
	for ( var e = 0; e < this.mString.length; e += f) {
		d = e;
		var c = true;
		for ( var b = 0; b < f; ++b) {
			if (this.mString[e + b] != a[b]) {
				c = false;
				break
			}
		}
		if (!c) {
			break
		}
	}
	if (d != 0) {
		this.mString = this.mString.substring(d)
	}
	return this
};
String.prototype.Parse = function(a) {
};
String.prototype.Scan = function(a) {
};
function Timer() {
	this.mEnable = false;
	this.mInterval = 1;
	this.mTimer = 0;
	this.OnTimer = new Event()
}
Timer.Pause = false;
Timer.mSigTimer = new Event();
Timer.prototype.OnSigTimer = function() {
	if (this.mEnable && (Timer.GetTime() >= this.mTimer)) {
		this.OnTimer.Dispatch();
		this.mTimer = Timer.GetTime() + this.mInterval
	}
};
Timer.SigTimer = function() {
	if (!Timer.Pause) {
		Timer.mSigTimer.Dispatch()
	}
};
Timer.prototype.Start = function() {
	if (!this.mEnable) {
		this.mEnable = true;
		this.mTimer = Timer.GetTime() + this.mInterval;
		Timer.mSigTimer.Add(this.OnSigTimer, this)
	}
};
Timer.prototype.Stop = function() {
	if (this.mEnable) {
		this.mEnable = false;
		Timer.mSigTimer.Remove(this.OnSigTimer)
	}
};
Timer.prototype.IsEnabled = function() {
	return this.mEnable
};
Timer.prototype.SetInterval = function(a) {
	this.mInterval = a;
	this.mTimer = Timer.GetTime() + this.mInterval
};
Timer.prototype.GetInterval = function() {
	return this.mInterval
};
Timer.GetTime = function() {
	return (new Date).getTime() * 0.001
};
function Keyframe(a) {
	this.Time = (a != null) ? a : 0
}
Keyframe.prototype.Initialize = function() {
};
Keyframe.prototype.Interpolate = function(a, b) {
	return new Keyframe()
};
function KeyframeDouble(b, a) {
	Keyframe.call(this, b);
	this.Value = (a != null) ? a : 0
}
KeyframeDouble.prototype = new Keyframe();
KeyframeDouble.prototype.constructor = KeyframeDouble;
KeyframeDouble.prototype.Interpolate = function(b, c) {
	var a = new KeyframeDouble();
	a.Value = this.Value + (b.Value - this.Value) * c;
	return a
};
function KeyframePoint(b, a) {
	Keyframe.call(this, b);
	this.KeyPoint = (a != null) ? a : new Point()
}
KeyframePoint.prototype = new Keyframe();
KeyframePoint.prototype.constructor = KeyframePoint;
KeyframePoint.prototype.Interpolate = function(b, c) {
	var a = new KeyframePoint();
	a.KeyPoint.x = this.KeyPoint.x + (b.KeyPoint.x - this.KeyPoint.x) * c;
	a.KeyPoint.y = this.KeyPoint.y + (b.KeyPoint.y - this.KeyPoint.y) * c;
	a.KeyPoint.z = this.KeyPoint.z + (b.KeyPoint.z - this.KeyPoint.z) * c;
	a.KeyPoint.w = this.KeyPoint.w + (b.KeyPoint.w - this.KeyPoint.w) * c;
	return a
};
function KeyframeAnimation() {
	this.KeyframeList = new Array();
	this.Easing = null
}
KeyframeAnimation.prototype.Add = function(b) {
	if (this.KeyframeList.length == 0) {
		this.KeyframeList.push(b)
	} else {
		var a;
		for (a = 0; a < this.KeyframeList.length; ++a) {
			if (this.KeyframeList[a].Time > b.Time) {
				this.KeyframeList.splice(a, 0, b);
				break
			}
		}
		if (a == this.KeyframeList.length) {
			this.KeyframeList.push(b)
		}
	}
};
KeyframeAnimation.prototype.Remove = function(a) {
	this.KeyframeList.splice(a, 1)
};
KeyframeAnimation.prototype.Clear = function() {
	this.KeyframeList = new Array()
};
KeyframeAnimation.prototype.GetEndTime = function() {
	if (this.KeyframeList.length > 0) {
		return this.KeyframeList[this.KeyframeList.length - 1].Time
	}
	return 0
};
KeyframeAnimation.prototype.Frame = function(a) {
	if (a < this.KeyframeList.length) {
		return this.KeyframeList[a]
	}
	return null
};
KeyframeAnimation.prototype.FindFrame = function(b) {
	for ( var a = 0; a < this.KeyframeList.length; ++a) {
		if (this.KeyframeList[a].Time >= b) {
			return this.KeyframeList[a]
		}
	}
	if (this.KeyframeList.length > 0) {
		return this.KeyframeList[this.KeyframeList.length - 1]
	}
	return null
};
KeyframeAnimation.prototype.InitializeKeyframes = function() {
	for ( var a = 0; a < this.KeyframeList.length; ++a) {
		this.KeyframeList[a].Initialize()
	}
};
KeyframeAnimation.prototype.Interpolate = function(f) {
	var b = -1;
	for ( var d = 0; d < this.KeyframeList.length; ++d) {
		if (this.KeyframeList[d].Time >= f) {
			b = d;
			break
		}
	}
	if (b != -1) {
		if ((b == 0)
				|| ((b == (this.KeyframeList.length - 1)) && (this.KeyframeList[b].Time <= f))) {
			return this.KeyframeList[b]
		} else {
			var e = this.KeyframeList[b - 1];
			var a = this.KeyframeList[b];
			var g = (f - e.Time) / (a.Time - e.Time);
			if (this.Easing != null) {
				g = this.Easing.Ease(g)
			}
			var c = e.Interpolate(a, g);
			c.Time = f;
			return c
		}
	}
	if (this.KeyframeList.length > 0) {
		return this.KeyframeList[this.KeyframeList.length - 1]
	}
	return new Keyframe()
};
function Storyboard() {
	this.OnStart = new Event();
	this.OnUpdate = new Event();
	this.OnEnd = new Event();
	this.Name;
	this.Animation = new Array();
	this.Loop = false;
	this.PlayTime = 0;
	this.mStartTime = 0;
	this.mPauseTime = 0;
	this.mTimer = new Timer();
	this.mTimer.SetInterval(0);
	this.mTimer.OnTimer.Add(Storyboard.prototype.OnTimer, this)
}
Storyboard.prototype.OnTimer = function() {
	var c = new Array();
	this.PlayTime = Timer.GetTime() - this.mStartTime;
	var d = 0;
	for ( var b = 0; b < this.Animation.length; ++b) {
		var a = this.Animation[b].Interpolate(this.PlayTime);
		c.push(a);
		if (c[b].Time >= this.Animation[b].GetEndTime()) {
			++d
		}
	}
	this.OnUpdate.Dispatch(c);
	if (d == c.length) {
		if (this.Loop) {
			this.mStartTime = Timer.GetTime()
		} else {
			this.Stop()
		}
	}
};
Storyboard.prototype.Play = function(b) {
	if (b == null) {
		b = 0
	}
	this.PlayTime = b;
	for ( var a = 0; a < this.Animation.length; ++a) {
		this.Animation[a].InitializeKeyframes()
	}
	this.mStartTime = Timer.GetTime();
	this.mTimer.Start();
	this.OnStart.Dispatch()
};
Storyboard.prototype.Stop = function() {
	if (this.mTimer.IsEnabled()) {
		this.mTimer.Stop();
		this.OnEnd.Dispatch()
	}
};
Storyboard.prototype.Pause = function() {
	this.mTimer.Stop();
	this.mPauseTime = Timer.GetTime() - this.mStartTime
};
Storyboard.prototype.Resume = function() {
	this.mStartTime = Timer.GetTime() - this.mPauseTime;
	this.mTimer.Start()
};
Storyboard.prototype.GetFrames = function(d) {
	var c = new Array();
	for ( var b = 0; b < this.Animation.length; ++b) {
		var a = this.Animation[b].Interpolate(d);
		c.push(a)
	}
	return c
};
Storyboard.prototype.GetEndTime = function() {
	var b = 0;
	var a = 0;
	for ( var c = 0; c < this.Animation.length; ++c) {
		a = this.Animation[c].GetEndTime();
		if (b < a) {
			b = a
		}
	}
	return b
};
Storyboard.prototype.IsPlaying = function() {
	return this.mTimer.IsEnabled()
};
function StoryboardGroup() {
	this.mStoryboardList = new Array();
	this.Name
}
StoryboardGroup.prototype.AddStoryboard = function(a) {
	this.mStoryboardList.push(a)
};
StoryboardGroup.prototype.RemoveStoryboard = function(a) {
	for ( var b = 0; b < this.mStoryboardList.length; ++b) {
		if (this.mStoryboardList[b].Name == a) {
			this.mStoryboardList[b].Stop();
			this.mStoryboardList.splice(b, 1);
			break
		}
	}
};
StoryboardGroup.prototype.GetStoryboard = function(a) {
	for ( var b = 0; b < this.mStoryboardList.length; ++b) {
		if (this.mStoryboardList[b].Name == a) {
			return this.mStoryboardList[b]
		}
	}
	return null
};
StoryboardGroup.prototype.Clear = function() {
	this.StopAll();
	this.mStoryboardList = new Array()
};
StoryboardGroup.prototype.Play = function(a, c) {
	if (c == null) {
		c = 0
	}
	var b = this.GetStoryboard(a);
	if (b != null) {
		this.StopAll();
		b.Play(c);
		return true
	}
	return false
};
StoryboardGroup.prototype.Stop = function(a) {
	var b = this.GetStoryboard(a);
	if (b != null) {
		b.Stop()
	}
};
StoryboardGroup.prototype.StopAll = function() {
	for ( var a = 0; a < this.mStoryboardList.length; ++a) {
		this.mStoryboardList[a].Stop()
	}
};
function StoryboardManager() {
	this.mStoryboard = new Array();
	this.mStoryboardGroup = new Array()
}
StoryboardManager.prototype.AddStoryboard = function(a) {
	this.mStoryboard.push(a)
};
StoryboardManager.prototype.RemoveStoryboard = function(a) {
	for ( var b = 0; b < this.mStoryboard.length; ++b) {
		if (this.mStoryboard[b].Name == a) {
			this.mStoryboard[b].Stop();
			this.mStoryboard.splice(b, 1);
			break
		}
	}
};
StoryboardManager.prototype.GetStoryboard = function(a) {
	for ( var c = 0; c < this.mStoryboard.length; ++c) {
		if (this.mStoryboard[c].Name == a) {
			return this.mStoryboard[c]
		}
	}
	for ( var c = 0; c < this.mStoryboardGroup.length; ++c) {
		var b = this.mStoryboardGroup[c].GetStoryboard(a);
		if (b != null) {
			return b
		}
	}
	return null
};
StoryboardManager.prototype.AddGroup = function(a) {
	this.mStoryboardGroup.push(a)
};
StoryboardManager.prototype.RemoveGroup = function(a) {
	for ( var b = 0; b < this.mStoryboardGroup.length; ++b) {
		if (this.mStoryboardGroup[b].Name == a) {
			this.mStoryboardGroup[b].StopAll();
			this.mStoryboardGroup.splice(b, 1);
			break
		}
	}
};
StoryboardManager.prototype.Clear = function() {
	for ( var a = 0; a < this.mStoryboard.length; ++a) {
		this.mStoryboard[a].Stop()
	}
	this.mStoryboard = new Array();
	for ( var a = 0; a < this.mStoryboardGroup.length; ++a) {
		this.mStoryboardGroup[a].StopAll()
	}
	this.mStoryboardGroup = new Array()
};
StoryboardManager.prototype.Play = function(a, c) {
	if (c == null) {
		c = 0
	}
	for ( var b = 0; b < this.mStoryboard.length; ++b) {
		if (this.mStoryboard[b].Name == a) {
			this.mStoryboard[b].Play(c);
			return true
		}
	}
	for ( var b = 0; b < this.mStoryboardGroup.length; ++b) {
		if (this.mStoryboardGroup[b].Play(a)) {
			return true
		}
	}
	return false
};
StoryboardManager.prototype.Stop = function(a) {
	for ( var b = 0; b < this.mStoryboard.length; ++b) {
		if (this.mStoryboard[b].Name == a) {
			this.mStoryboard[b].Stop();
			return
		}
	}
	for ( var b = 0; b < this.mStoryboardGroup.length; ++b) {
		this.mStoryboardGroup[b].Stop(a)
	}
};
StoryboardManager.prototype.StopAll = function() {
	for ( var a = 0; a < this.mStoryboard.length; ++a) {
		this.mStoryboard[a].Stop()
	}
	for ( var a = 0; a < this.mStoryboardGroup.length; ++a) {
		this.mStoryboardGroup[a].StopAll()
	}
};
function EasingFunction() {
	this.Mode = EasingFunction.EasingMode.EaseIn
}
EasingFunction.EasingMode = {
	EaseIn : 0,
	EaseOut : 1,
	EaseInOut : 2
};
EasingFunction.prototype.GetEase = function(a) {
	return a
};
EasingFunction.prototype.Ease = function(a) {
	return ((this.Mode == EasingFunction.EasingMode.EaseIn) ? this.GetEase(a)
			: (this.Mode == EasingFunction.EasingMode.EaseOut) ? 1 - this
					.GetEase(1 - a) : (a > 0.5) ? 1 - (this
					.GetEase(1 - ((a - 0.5) * 2)) * 0.5)
					: this.GetEase(a * 2) * 0.5)
};
function CubicEase() {
	EasingFunction.call(this)
}
CubicEase.prototype = new EasingFunction();
CubicEase.prototype.constructor = CubicEase;
CubicEase.prototype.GetEase = function(a) {
	return a * a * a
};
function QuadraticEase() {
	EasingFunction.call(this)
}
QuadraticEase.prototype = new EasingFunction();
QuadraticEase.prototype.constructor = QuadraticEase;
QuadraticEase.prototype.GetEase = function(a) {
	return a * a
};
function DataObject() {
	this.Dictionary = new Array();
	this.OnPropertyChanged = new Event()
}
DataObject.prototype.GetValue = function(a) {
	return this.Dictionary[a]
};
DataObject.prototype.SetValue = function(a, b) {
	this.Dictionary[a] = b;
	this.OnPropertyChanged.Dispatch(this, a)
};
DataObject.prototype.AppendDictionary = function(a) {
	this.Dictionary = this.Dictionary.concat(a)
};
DataObject.prototype.Clear = function() {
	this.Dictionary = new Array()
};
function Locale() {
	DataObject.call(this);
	this.mLocaleCode
}
Locale.prototype = new DataObject();
Locale.prototype.constructor = Locale;
Locale.prototype.Import = function(g, e) {
	this.mLocaleCode = e;
	var a = new StreamReader(g);
	while (!a.IsEndOfStream()) {
		var b = a.ReadLine();
		if (b.StartsWith("#") == false) {
			var c = b.IndexOf("=");
			if (c != -1) {
				var d = b.Substring(0, c);
				var f = b.Substring(c + 1);
				this.SetValue(d, f)
			}
		}
	}
};
Locale.prototype.GetValue = function(a, d) {
	var c = DataObject.prototype.GetValue.call(this, a);
	if (c.Length() > 0) {
		for ( var b = 0; b < d.length; ++b) {
			c = c.replace(new String().Parse("{%d}", b), d[b])
		}
	}
	return c
};
Locale.prototype.GetLocalCode = function() {
	return this.mLocaleCode
};
SeekOrigin = {
	Begin : 0,
	Current : 1,
	End : 2
};
function Stream() {
	this.mCanRead = false;
	this.mCanSeek = false;
	this.mCanTimeout = false;
	this.mCanWrite = false;
	this.mLength = 0;
	this.mPosition = 0;
	this.mReadTimeout = 0;
	this.mWriteTimeout = 0
}
Stream.prototype.CanRead = function() {
	return this.mCanRead
};
Stream.prototype.CanSeek = function() {
	return this.mCanSeek
};
Stream.prototype.CanTimeout = function() {
	return this.mCanTimeout
};
Stream.prototype.CanWrite = function() {
	return this.mCanWrite
};
Stream.prototype.Length = function() {
	return this.mLength
};
Stream.prototype.GetPosition = function() {
	return this.mPosition
};
Stream.prototype.SetPosition = function(a) {
	if (a < this.mLength) {
		this.mPosition = a
	} else {
		this.mPosition = this.mLength
	}
	return this.mPosition
};
Stream.prototype.GetReadTimeout = function() {
	return this.mReadTimeout
};
Stream.prototype.SetReadTimeout = function(a) {
	this.mReadTimeout = a;
	return this.mReadTimeout
};
Stream.prototype.GetWriteTimeout = function() {
	return this.mWriteTimeout
};
Stream.prototype.SetWriteTimeout = function(a) {
	this.mWriteTimeout = a;
	return this.mWriteTimeout
};
Stream.prototype.Close = function() {
};
Stream.prototype.Flush = function() {
};
Stream.prototype.Read = function(a, c, b) {
};
Stream.prototype.ReadByte = function() {
	return 0
};
Stream.prototype.Seek = function(b, a) {
};
Stream.prototype.SetLength = function(a) {
};
Stream.prototype.Write = function(a, c, b) {
};
Stream.prototype.WriteByte = function(a) {
};
function MemoryStream(a) {
	Stream.call(this);
	this.mBuffer = !a ? new String() : a;
	this.mLength = a ? a.length : 0;
	this.mCanRead = true;
	this.mCanSeek = true;
	this.mCanWrite = true
}
MemoryStream.prototype = new Stream();
MemoryStream.prototype.constructor = MemoryStream;
MemoryStream.prototype.Close = function() {
	if (this.mBuffer != null) {
		this.mBuffer = 0;
		this.mPosition = 0;
		this.mLength = 0
	}
};
MemoryStream.prototype.Capacity = function(a) {
	this.mBuffer = "";
	if ((a != null) && (a > 0)) {
		this.mBuffer.length = a
	}
};
MemoryStream.prototype.Flush = function() {
};
MemoryStream.prototype.GetBuffer = function() {
	return this.mBuffer
};
MemoryStream.prototype.Read = function(a, c, b) {
	if ((this.mBuffer != null) && this.mCanRead) {
		if ((this.mPosition + b) >= this.mLength) {
			b = this.mLength - this.mPosition
		}
		if (b > 0) {
			a = this.mBuffer.substring(this.mPosition, this.mPosition + b);
			this.mPosition += b;
			return b
		}
	}
	return 0
};
MemoryStream.prototype.ReadByte = function() {
	if ((this.mBuffer != null) && this.mCanRead
			&& (this.mPosition < this.mLength)) {
		return this.mBuffer[this.mPosition++]
	}
	return 0
};
MemoryStream.prototype.Seek = function(b, a) {
	if ((this.mBuffer != null) && this.mCanSeek) {
		if (a == SeekOrigin.Begin) {
			this.mPosition = b
		} else {
			if (a == SeekOrigin.Current) {
				this.mPosition += b
			} else {
				if (a == SeekOrigin.End) {
					this.mPosition = this.mLength - b
				}
			}
		}
		if (this.mPosition < 0) {
			this.mPosition = 0
		} else {
			if (this.mPosition > this.mLength) {
				this.mPosition = this.mLength
			}
		}
	}
	return this.mPosition
};
MemoryStream.prototype.SetLength = function() {
};
MemoryStream.prototype.Write = function(a, c, b) {
	if ((this.mBuffer != null) && this.mCanWrite) {
		if (c == null) {
			c = 0
		}
		if (b == null) {
			b = a.length
		}
		if ((this.mPosition + b) > this.mLength) {
			this
					.SetLength(this.mLength
							+ ((this.mPosition + b) - this.mLength))
		}
		if (b > 0) {
			this.mBuffer += a;
			this.mPosition += b
		}
	}
};
MemoryStream.prototype.WriteByte = function(a) {
	if ((this.mBuffer != null) && this.mCanWrite) {
		if (this.mPosition < this.mLength) {
			this.mBuffer[this.mPosition++] = a
		}
	}
};
MemoryStream.prototype.WriteTo = function(a) {
	if (this.mBuffer != null) {
		a.Write(this.mBuffer, 0, this.mLength)
	}
};
function StreamReader(a) {
	this.mStream = a
}
StreamReader.prototype.GetStream = function() {
	return this.mStream
};
StreamReader.prototype.IsEndOfStream = function() {
	return (this.mStream.GetPosition() == this.mStream.Length())
};
StreamReader.prototype.Close = function() {
	this.mStream.Close()
};
StreamReader.prototype.Peek = function() {
	if (this.mStream.GetPosition() != this.mStream.Length()) {
		var a = this.mStream.ReadByte();
		this.mStream.Seek(-1, SeekOrigin.Current);
		return a
	}
	return -1
};
StreamReader.prototype.Read = function() {
	return this.mStream.ReadByte()
};
StreamReader.prototype.ReadLine = function() {
	var a = "";
	var b = "";
	while ((b != "\n") && (this.mStream.GetPosition() < this.mStream.Length())) {
		b = this.mStream.ReadByte();
		if (b != "\n") {
			a += b
		}
	}
	return a
};
StreamReader.prototype.ReadToEnd = function() {
	var b = this.mStream.Length() - this.mStream.GetPosition();
	if (b > 0) {
		var a;
		this.mStream.Read(a, 0, b);
		return a
	}
	return ""
};
function StreamWriter(a) {
	this.mStream = a
}
StreamWriter.prototype.GetStream = function() {
	return this.mStream
};
StreamWriter.prototype.Close = function() {
	this.mStream.Close()
};
StreamWriter.prototype.Write = function(c, a, b) {
	this.mStream.Write(c, a, b)
};
function Point(a, d, c, b) {
	this.x = a ? a : 0;
	this.y = d ? d : 0;
	this.z = c ? c : 0;
	this.w = b ? b : 0
}
Point.prototype.At = function(a) {
	return (a == 0) ? x : (a == 1) ? y : (a == 2) ? z : w
};
Point.prototype.At = function(a, b) {
	if (a == 0) {
		x = b
	} else {
		if (a == 1) {
			y = b
		} else {
			if (a == 2) {
				z = b
			} else {
				w = b
			}
		}
	}
};
Point.prototype.NotEqual = function(a) {
	return (this.x != a.x) || (this.y != a.y) || (this.z != a.z)
			|| (this.w != a.w)
};
Point.prototype.LessThan = function(a) {
	return (this.x < a.x) && (this.y < a.y) && (this.z < a.z) && (this.w < a.w)
};
Point.prototype.LessThanEqual = function(a) {
	return (this.x <= a.x) && (this.y <= a.y) && (this.z <= a.z)
			&& (this.w <= a.w)
};
Point.prototype.GreaterThan = function(a) {
	return (this.x > a.x) && (this.y > a.y) && (this.z > a.z) && (this.w > a.w)
};
Point.prototype.GreaterThanEqual = function(a) {
	return (this.x >= a.x) && (this.y >= a.y) && (this.z >= a.z)
			&& (this.w >= a.w)
};
Point.prototype.Equal = function(a) {
	return (this.x == a.x) && (this.y == a.y) && (this.z == a.z)
			&& (this.w == a.w)
};
Point.prototype.Add = function(a) {
	return new Point(this.x + a.x, this.y + a.y, this.z + a.z, this.w + a.w)
};
Point.prototype.Negative = function() {
	return new Point(-this.x, -this.y, -this.z, -this.w)
};
Point.prototype.Subtract = function(a) {
	return new Point(this.x - a.x, this.y - a.y, this.z - a.z, this.w - a.w)
};
Point.prototype.Multiply = function(a) {
	return new Point(this.x * a.x, this.y * a.y, this.z * a.z, this.w * a.w)
};
Point.prototype.Divide = function(a) {
	return new Point(this.x / a.x, this.y / a.y, this.z / a.z, this.w / a.w)
};
Point.prototype.Absolute = function() {
	return new Point(this.x < 0 ? -this.x : this.x, this.y < 0 ? -this.y
			: this.y, this.z < 0 ? -this.z : this.z, this.w < 0 ? -this.w
			: this.w)
};
Point.prototype.Clamp = function(b, a) {
	return new Point(this.x < b ? b : this.x > a ? a : this.x, this.y < b ? b
			: this.y > a ? a : this.y,
			this.z < b ? b : this.z > a ? a : this.z, this.w < b ? b
					: this.w > a ? a : this.w)
};
Point.prototype.Cross = function(a) {
	return new Point(this.y * a.z - this.z * a.y, this.z * a.x - this.x * a.z,
			this.x * a.y - this.y * a.x)
};
Point.prototype.Distance = function(a) {
	return Math.sqrt(((this.x - a.x) * (this.x - a.x))
			+ ((this.y - a.y) * (this.y - a.y))
			+ ((this.z - a.z) * (this.z - a.z)))
};
Point.prototype.Dot = function(a) {
	return ((this.x * a.x) + (this.y * a.y) + (this.z * a.z))
};
Point.prototype.Magnitude = function() {
	return Math.sqrt((this.x * this.x) + (this.y * this.y) + (this.z * this.z)
			+ (this.w * this.w))
};
Point.prototype.Normalize = function() {
	var a = this.Magnitude();
	if (a != 0) {
		this.x /= a;
		this.y /= a;
		this.z /= a;
		this.w /= a
	}
	return this
};
Point.prototype.Reflect = function(b) {
	var a = this.Dot(b);
	return new Point(this.x - 2 * b.x * a, this.y - 2 * b.y * a, this.z - 2
			* b.z * a)
};
Point.prototype.SetPoint = function(a, d, c, b) {
	this.x = a ? a : 0;
	this.y = d ? d : 0;
	this.z = c ? c : 0;
	this.w = b ? b : 0
};
Quaternion.prototype = new Point();
Quaternion.prototype.constructor = Quaternion;
function Quaternion() {
	this.x = 0;
	this.y = 0;
	this.z = 0;
	this.w = 1
}
Quaternion.prototype.ToQuaternion = function(a) {
	var d = new Quaternion();
	var c = a.MMatrix[0] + a.MMatrix[5] + a.MMatrix[10];
	if (c > 0) {
		var b = 0.5 / Math.sqrt(c + 1);
		d.w = 0.25 / b;
		d.x = (a.MMatrix[9] - a.MMatrix[6]) * b;
		d.y = (a.MMatrix[2] - a.MMatrix[8]) * b;
		d.z = (a.MMatrix[4] - a.MMatrix[1]) * b
	} else {
		if ((a.MMatrix[0] > a.MMatrix[5]) && (a.MMatrix[0] > a.MMatrix[10])) {
			var b = Math.sqrt(1 + a.MMatrix[0] - a.MMatrix[5] - a.MMatrix[10]) * 2;
			d.w = (a.MMatrix[9] - a.MMatrix[6]) / b;
			d.x = 0.25 * b;
			d.y = (a.MMatrix[1] + a.MMatrix[4]) / b;
			d.z = (a.MMatrix[2] + a.MMatrix[8]) / b
		} else {
			if (a.MMatrix[5] > a.MMatrix[10]) {
				var b = Math.sqrt(1 + a.MMatrix[5] - a.MMatrix[0]
						- a.MMatrix[10]) * 2;
				d.w = (a.MMatrix[2] - a.MMatrix[8]) / b;
				d.x = (a.MMatrix[1] + a.MMatrix[4]) / b;
				d.y = 0.25 * b;
				d.z = (a.MMatrix[6] + a.MMatrix[9]) / b
			} else {
				var b = Math.sqrt(1 + a.MMatrix[10] - a.MMatrix[0]
						- a.MMatrix[5]) * 2;
				d.w = (a.MMatrix[4] - a.MMatrix[1]) / b;
				d.x = (a.MMatrix[2] + a.MMatrix[8]) / b;
				d.y = (a.MMatrix[6] + a.MMatrix[9]) / b;
				d.z = 0.25 * b
			}
		}
	}
	return d
};
Quaternion.prototype.Multiply = function(b) {
	var a = new Quaternion();
	a.w = this.w * b.w - this.x * b.x - this.y * b.y - this.z * b.z;
	a.x = this.x * b.w + this.w * b.x - this.z * b.y + this.y * b.z;
	a.y = this.y * b.w + this.z * b.x + this.w * b.y - this.x * b.z;
	a.z = this.z * b.w - this.y * b.x + this.x * b.y + this.w * b.z;
	return a
};
Quaternion.prototype.SetMatrix = function(b) {
	var a = this.ToQuaternion(b);
	this.SetPoint(a.x, a.y, a.z, a.w)
};
Quaternion.prototype.SetAxis = function(b) {
	var a = Math.sin(b.w * 0.5);
	this.SetPoint(b.x * a, b.y * a, b.z * a, Math.cos(b.w * 0.5))
};
Quaternion.prototype.RotateAxis = function(a, e, d, b) {
	b *= Math.PI / 180;
	var c = Math.sin(b * 0.5);
	this.w = Math.cos(b * 0.5);
	this.x = a * c;
	this.y = e * c;
	this.z = d * c;
	this.Normalize()
};
Quaternion.prototype.Rotate = function(b, g, e) {
	var c = new Quaternion();
	var a = new Quaternion();
	var f = new Quaternion();
	var d = new Quaternion();
	c.RotateAxis(1, 0, 0, b);
	a.RotateAxis(0, 1, 0, g);
	f.RotateAxis(0, 0, 1, e);
	d = (c.Multiply(a)).Multiply(f);
	this.SetPoint(d.x, d.y, d.z, d.w)
};
Quaternion.prototype.Transform = function(b) {
	var c = this.x * this.x;
	var d = this.y * this.y;
	var a = this.z * this.z;
	b.SetPoint((b.x * (1 - 2 * (d + a)))
			+ (b.y * (2 * (this.x * this.y + this.z * this.w)))
			+ (b.z * (2 * (this.x * this.z - this.y * this.w))),
			(b.x * (2 * (this.x * this.y - this.z * this.w)))
					+ (b.y * (1 - 2 * (c + a)))
					+ (b.z * (2 * (this.y * this.z + this.x * this.w))),
			(b.x * (2 * (this.x * this.z + this.y * this.w)))
					+ (b.y * (2 * (this.y * this.z - this.x * this.w)))
					+ (b.z * (1 - 2 * (c + d))))
};
Quaternion.prototype.ToMatrix = function(b) {
	var c = this.x * this.x;
	var d = this.y * this.y;
	var a = this.z * this.z;
	b[0] = 1 - 2 * (d + a);
	b[1] = 2 * (this.x * this.y - this.z * this.w);
	b[2] = 2 * (this.x * this.z + this.y * this.w);
	b[4] = 2 * (this.x * this.y + this.z * this.w);
	b[5] = 1 - 2 * (c + a);
	b[6] = 2 * (this.y * this.z - this.x * this.w);
	b[8] = 2 * (this.x * this.z - this.y * this.w);
	b[9] = 2 * (this.y * this.z + this.x * this.w);
	b[10] = 1 - 2 * (c + d)
};
Quaternion.prototype.ToAxisAngle = function() {
	var a = this.Magnitude();
	if (a != 0) {
		return new Point(this.x / a, this.y / a, this.z / a, 2 * Math
				.acos(this.w))
	}
	return new Point()
};
function Matrix(b, a) {
	this.MMatrix = [ b * a ];
	this.NumRows = b;
	this.NumColumns = a;
	this.Rotation = new Point();
	this.ScaleValue = new Point(1, 1, 1, 1);
	this.SetIdentity()
}
Matrix.prototype.GetDeterminant = function(c, e) {
	if (e < 1) {
		return 0
	} else {
		if (e == 1) {
			return c.MMatrix[0]
		} else {
			if (e == 2) {
				return (c.MMatrix[0] * c.MMatrix[3])
						- (c.MMatrix[1] * c.MMatrix[2])
			} else {
				if (e == 3) {
					return (c.MMatrix[0] * c.MMatrix[4] * c.MMatrix[8])
							- (c.MMatrix[0] * c.MMatrix[5] * c.MMatrix[7])
							- (c.MMatrix[1] * c.MMatrix[3] * c.MMatrix[8])
							+ (c.MMatrix[1] * c.MMatrix[5] * c.MMatrix[6])
							+ (c.MMatrix[2] * c.MMatrix[3] * c.MMatrix[7])
							- (c.MMatrix[2] * c.MMatrix[4] * c.MMatrix[6])
				} else {
					var b = 0;
					for ( var d = 0; d < e; ++d) {
						var f = new Matrix(e - 1, e - 1);
						for ( var g = 0; g < (e - 1); ++g) {
							for ( var a = 0; a < (e - 1); ++a) {
								f.SetValue(g, a, c.GetValue(g + 1,
										a >= d ? (a + 1) : a))
							}
						}
						b += c.GetValue(0, d) * (Math.pow(-1, 0 + d))
								* this.GetDeterminant(f, e - 1)
					}
					return b
				}
			}
		}
	}
};
Matrix.prototype.At = function(a) {
	return this.MMatrix[a]
};
Matrix.prototype.At = function(a, b) {
	this.MMatrix[a] = b
};
Matrix.prototype.Equal = function(a) {
	if ((this.NumRows != a.NumRows) || (this.NumColumns != a.NumColumns)) {
		return false
	}
	var c = this.NumRows * this.NumColumns;
	for ( var b = 0; b < c; ++b) {
		if (this.MMatrix[b] != a.MMatrix[b]) {
			return false
		}
	}
	return true
};
Matrix.prototype.NotEqual = function(a) {
	return ((this.Equal(matrix2)) == false)
};
Matrix.prototype.Add = function(a) {
	if ((this.NumRows != a.NumRows) || (this.NumColumns != a.NumColumns)) {
		return this
	}
	var b = new Matrix(this.NumRows, this.NumColumns);
	var d = b.GetSize();
	for ( var c = 0; c < d; ++c) {
		b.MMatrix[c] = this.MMatrix[c] + a.MMatrix[c]
	}
	return b
};
Matrix.prototype.Subtract = function(a) {
	if ((this.NumRows != a.NumRows) || (this.NumColumns != a.NumColumns)) {
		return this
	}
	var b = new Matrix(this.NumRows, this.NumColumns);
	var d = b.GetSize();
	for ( var c = 0; c < d; ++c) {
		b.MMatrix[c] = this.MMatrix[c] - matrix2.MMatrix[c]
	}
	return b
};
Matrix.prototype.Multiply = function(b) {
	if ((this.NumRows != b.NumRows) || (this.NumColumns != b.NumColumns)) {
		return this
	}
	var d = new Matrix(this.NumRows, this.NumColumns);
	var f = d.GetSize();
	for ( var e = 0; e < f; ++e) {
		d.MMatrix[e] = 0
	}
	for ( var e = 0; e < d.NumRows; ++e) {
		var g = e * d.NumColumns;
		for ( var c = 0; c < d.NumColumns; ++c) {
			for ( var a = 0; a < d.NumColumns; ++a) {
				d.MMatrix[g + c] += (this.MMatrix[g + a] * b.MMatrix[a
						* d.NumColumns + c])
			}
		}
	}
	d.ScaleValue.x = this.ScaleValue.x * b.ScaleValue.x;
	d.ScaleValue.y = this.ScaleValue.y * b.ScaleValue.y;
	d.ScaleValue.z = this.ScaleValue.z * b.ScaleValue.z;
	return d
};
Matrix.prototype.MultiplyPoint = function(a) {
	if (this.NumRows == this.NumColumns) {
		var b = a.Multiply(this.ScaleValue);
		if (this.NumRows == 4) {
			return new Point(
					(this.MMatrix[0] * b.x) + (this.MMatrix[1] * b.y)
							+ (this.MMatrix[2] * b.z) + (this.MMatrix[3] * b.w),
					(this.MMatrix[4] * b.x) + (this.MMatrix[5] * b.y)
							+ (this.MMatrix[6] * b.z) + (this.MMatrix[7] * b.w),
					(this.MMatrix[8] * b.x) + (this.MMatrix[9] * b.y)
							+ (this.MMatrix[10] * b.z)
							+ (this.MMatrix[11] * b.w),
					(this.MMatrix[12] * b.x) + (this.MMatrix[13] * b.y)
							+ (this.MMatrix[14] * b.z)
							+ (this.MMatrix[15] * b.w))
		} else {
			if (this.NumRows == 3) {
				return new Point((this.MMatrix[0] * b.x)
						+ (this.MMatrix[1] * b.y) + (this.MMatrix[2] * b.z),
						(this.MMatrix[3] * b.x) + (this.MMatrix[4] * b.y)
								+ (this.MMatrix[5] * b.z),
						(this.MMatrix[6] * b.x) + (this.MMatrix[7] * b.y)
								+ (this.MMatrix[8] * b.z))
			} else {
				if (this.NumRows == 2) {
					return new Point((this.MMatrix[0] * b.x)
							+ (this.MMatrix[1] * b.y), (this.MMatrix[2] * b.x)
							+ (this.MMatrix[3] * b.y))
				}
			}
		}
	}
	return a
};
Matrix.prototype.PointMultiply = function(a) {
	if (this.NumRows == this.NumColumns) {
		var b = a.Multiply(this.ScaleValue);
		if (this.NumRows == 4) {
			return new Point((this.MMatrix[0] * b.x) + (this.MMatrix[4] * b.y)
					+ (this.MMatrix[8] * b.z) + (this.MMatrix[12] * b.w),
					(this.MMatrix[1] * b.x) + (this.MMatrix[5] * b.y)
							+ (this.MMatrix[9] * b.z)
							+ (this.MMatrix[13] * b.w), (this.MMatrix[2] * b.x)
							+ (this.MMatrix[6] * b.y)
							+ (this.MMatrix[10] * b.z)
							+ (this.MMatrix[14] * b.w), (this.MMatrix[3] * b.x)
							+ (this.MMatrix[7] * b.y)
							+ (this.MMatrix[11] * b.z)
							+ (this.MMatrix[15] * b.w))
		} else {
			if (this.NumRows == 3) {
				return new Point((this.MMatrix[0] * b.x)
						+ (this.MMatrix[3] * b.y) + (this.MMatrix[6] * b.z),
						(this.MMatrix[1] * b.x) + (this.MMatrix[4] * b.y)
								+ (this.MMatrix[7] * b.z),
						(this.MMatrix[2] * b.x) + (this.MMatrix[5] * b.y)
								+ (this.MMatrix[8] * b.z))
			} else {
				if (this.NumRows == 2) {
					return new Point((this.MMatrix[0] * b.x)
							+ (this.MMatrix[2] * b.y), (this.MMatrix[1] * b.x)
							+ (this.MMatrix[3] * b.y))
				}
			}
		}
	}
	return a
};
Matrix.prototype.Transpose = function(b) {
	var a = new Matrix(this.NumRows, this.NumColumns);
	for ( var d = 0; d < a.NumRows; ++d) {
		for ( var c = 0; c < a.NumColumns; ++c) {
			a.SetValue(d, c, b.MMatrix[d + c * a.NumColumns])
		}
	}
	return a
};
Matrix.prototype.Inverse = function() {
	var a = new Matrix(4, 4);
	a.MMatrix[0] = this.MMatrix[0];
	a.MMatrix[1] = this.MMatrix[4];
	a.MMatrix[2] = this.MMatrix[8];
	a.MMatrix[4] = this.MMatrix[1];
	a.MMatrix[5] = this.MMatrix[5];
	a.MMatrix[6] = this.MMatrix[9];
	a.MMatrix[8] = this.MMatrix[2];
	a.MMatrix[9] = this.MMatrix[6];
	a.MMatrix[10] = this.MMatrix[10];
	a.Rotation.x = -this.Rotation.x;
	a.Rotation.y = -this.Rotation.y;
	a.Rotation.z = -this.Rotation.z;
	a.MMatrix[12] = -((a.MMatrix[0] * this.MMatrix[12])
			+ (a.MMatrix[4] * this.MMatrix[13]) + (a.MMatrix[8] * this.MMatrix[14]));
	a.MMatrix[13] = -((a.MMatrix[1] * this.MMatrix[12])
			+ (a.MMatrix[5] * this.MMatrix[13]) + (a.MMatrix[9] * this.MMatrix[14]));
	a.MMatrix[14] = -((a.MMatrix[2] * this.MMatrix[12])
			+ (a.MMatrix[6] * this.MMatrix[13]) + (a.MMatrix[10] * this.MMatrix[14]));
	a.ScaleValue.x = 1 / this.ScaleValue.x;
	a.ScaleValue.y = 1 / this.ScaleValue.y;
	a.ScaleValue.z = 1 / this.ScaleValue.z;
	a.ScaleValue.w = 1;
	return a
};
function SWAP_ROWS(d, c) {
	var e = d;
	d = c;
	c = e
}
Matrix.prototype.SlowInverse = function() {
	if ((this.NumRows != 4) || (this.NumColumns != 4)) {
		return this
	}
	var g = new Matrix(4, 4);
	var f = new Array();
	var m, k, j, h, l;
	var d = new Array();
	var c = new Array();
	var b = new Array();
	var a = new Array();
	d[0] = this.MMatrix[0 + 0 * 4];
	d[1] = this.MMatrix[0 + 1 * 4];
	d[2] = this.MMatrix[0 + 2 * 4];
	d[3] = this.MMatrix[0 + 3 * 4];
	d[4] = 1;
	d[5] = d[6] = d[7] = 0;
	c[0] = this.MMatrix[1 + 0 * 4];
	c[1] = this.MMatrix[1 + 1 * 4];
	c[2] = this.MMatrix[1 + 2 * 4];
	c[3] = this.MMatrix[1 + 3 * 4];
	c[5] = 1;
	c[4] = c[6] = c[7] = 0;
	b[0] = this.MMatrix[2 + 0 * 4];
	b[1] = this.MMatrix[2 + 1 * 4];
	b[2] = this.MMatrix[2 + 2 * 4];
	b[3] = this.MMatrix[2 + 3 * 4];
	b[6] = 1;
	b[4] = b[5] = b[7] = 0;
	a[0] = this.MMatrix[3 + 0 * 4];
	a[1] = this.MMatrix[3 + 1 * 4];
	a[2] = this.MMatrix[3 + 2 * 4];
	a[3] = this.MMatrix[3 + 3 * 4];
	a[7] = 1;
	a[4] = a[5] = a[6] = 0;
	if (Math.abs(a[0]) > Math.abs(b[0])) {
		SWAP_ROWS(a, b)
	}
	if (Math.abs(b[0]) > Math.abs(c[0])) {
		SWAP_ROWS(b, c)
	}
	if (Math.abs(c[0]) > Math.abs(d[0])) {
		SWAP_ROWS(c, d)
	}
	if (0 == d[0]) {
		return g
	}
	k = c[0] / d[0];
	j = b[0] / d[0];
	h = a[0] / d[0];
	l = d[1];
	c[1] -= k * l;
	b[1] -= j * l;
	a[1] -= h * l;
	l = d[2];
	c[2] -= k * l;
	b[2] -= j * l;
	a[2] -= h * l;
	l = d[3];
	c[3] -= k * l;
	b[3] -= j * l;
	a[3] -= h * l;
	l = d[4];
	if (l != 0) {
		c[4] -= k * l;
		b[4] -= j * l;
		a[4] -= h * l
	}
	l = d[5];
	if (l != 0) {
		c[5] -= k * l;
		b[5] -= j * l;
		a[5] -= h * l
	}
	l = d[6];
	if (l != 0) {
		c[6] -= k * l;
		b[6] -= j * l;
		a[6] -= h * l
	}
	l = d[7];
	if (l != 0) {
		c[7] -= k * l;
		b[7] -= j * l;
		a[7] -= h * l
	}
	if (Math.abs(a[1]) > Math.abs(b[1])) {
		SWAP_ROWS(a, b)
	}
	if (Math.abs(b[1]) > Math.abs(c[1])) {
		SWAP_ROWS(b, c)
	}
	if (0 == c[1]) {
		return g
	}
	j = b[1] / c[1];
	h = a[1] / c[1];
	b[2] -= j * c[2];
	a[2] -= h * c[2];
	b[3] -= j * c[3];
	a[3] -= h * c[3];
	l = c[4];
	if (0 != l) {
		b[4] -= j * l;
		a[4] -= h * l
	}
	l = c[5];
	if (0 != l) {
		b[5] -= j * l;
		a[5] -= h * l
	}
	l = c[6];
	if (0 != l) {
		b[6] -= j * l;
		a[6] -= h * l
	}
	l = c[7];
	if (0 != l) {
		b[7] -= j * l;
		a[7] -= h * l
	}
	if (Math.abs(a[2]) > Math.abs(b[2])) {
		SWAP_ROWS(a, b)
	}
	if (0 == b[2]) {
		return g
	}
	h = a[2] / b[2];
	a[3] -= h * b[3];
	a[4] -= h * b[4];
	a[5] -= h * b[5];
	a[6] -= h * b[6];
	a[7] -= h * b[7];
	if (0 == a[3]) {
		return g
	}
	l = (1 / a[3]);
	a[4] *= l;
	a[5] *= l;
	a[6] *= l;
	a[7] *= l;
	j = b[3];
	l = (1 / b[2]);
	b[4] = l * (b[4] - a[4] * j);
	b[5] = l * (b[5] - a[5] * j);
	b[6] = l * (b[6] - a[6] * j);
	b[7] = l * (b[7] - a[7] * j);
	k = c[3];
	c[4] -= a[4] * k;
	c[5] -= a[5] * k;
	c[6] -= a[6] * k;
	c[7] -= a[7] * k;
	m = d[3];
	d[4] -= a[4] * m;
	d[5] -= a[5] * m;
	d[6] -= a[6] * m;
	d[7] -= a[7] * m;
	k = c[2];
	l = (1 / c[1]);
	c[4] = l * (c[4] - b[4] * k);
	c[5] = l * (c[5] - b[5] * k);
	c[6] = l * (c[6] - b[6] * k);
	c[7] = l * (c[7] - b[7] * k);
	m = d[2];
	d[4] -= b[4] * m;
	d[5] -= b[5] * m;
	d[6] -= b[6] * m;
	d[7] -= b[7] * m;
	m = d[1];
	l = (1 / d[0]);
	d[4] = l * (d[4] - c[4] * m);
	d[5] = l * (d[5] - c[5] * m);
	d[6] = l * (d[6] - c[6] * m);
	d[7] = l * (d[7] - c[7] * m);
	f[0 + 0 * 4] = d[4];
	f[0 + 1 * 4] = d[5];
	f[0 + 2 * 4] = d[6];
	f[0 + 3 * 4] = d[7];
	f[1 + 0 * 4] = c[4];
	f[1 + 1 * 4] = c[5];
	f[1 + 2 * 4] = c[6];
	f[1 + 3 * 4] = c[7];
	f[2 + 0 * 4] = b[4];
	f[2 + 1 * 4] = b[5];
	f[2 + 2 * 4] = b[6];
	f[2 + 3 * 4] = b[7];
	f[3 + 0 * 4] = a[4];
	f[3 + 1 * 4] = a[5];
	f[3 + 2 * 4] = a[6];
	f[3 + 3 * 4] = a[7];
	for ( var e = 0; e < 16; ++e) {
		g.MMatrix[e] = f[e]
	}
	return g
};
Matrix.prototype.PointAt = function(b, e, a) {
	if (a == null) {
		a = new Point(0, 1, 0)
	}
	var c = new Point(e.x - b.x, e.y - b.y, e.z - b.z);
	c.Normalize();
	var a = new Point(0, 1, 0);
	var d = c.Cross(a);
	d.Normalize();
	a = d.Cross(c);
	this.MMatrix[0] = d.x;
	this.MMatrix[1] = d.y;
	this.MMatrix[2] = d.z;
	this.MMatrix[3] = 0;
	this.MMatrix[4] = a.x;
	this.MMatrix[5] = a.y;
	this.MMatrix[6] = a.z;
	this.MMatrix[7] = 0;
	this.MMatrix[8] = -c.x;
	this.MMatrix[9] = -c.y;
	this.MMatrix[10] = -c.z;
	this.MMatrix[11] = 0;
	this.MMatrix[12] = b.x;
	this.MMatrix[13] = b.y;
	this.MMatrix[14] = b.z;
	this.MMatrix[15] = 1
};
Matrix.prototype.Translate = function(a, c, b) {
	if ((this.NumRows == this.NumColumns) && (this.NumRows == 4)) {
		this.MMatrix[12] = a;
		this.MMatrix[13] = c;
		this.MMatrix[14] = b
	} else {
		if ((this.NumRows == this.NumColumns) && (this.NumRows == 3)) {
			this.MMatrix[6] = a;
			this.MMatrix[7] = c
		}
	}
};
Matrix.prototype.Rotate = function(a, d, c) {
	this.Rotation.SetPoint(a, d, c);
	var b = new Quaternion();
	b.Rotate(a, d, c);
	b.ToMatrix(this.MMatrix)
};
Matrix.prototype.Scale = function(a, c, b) {
	this.ScaleValue.SetPoint(a, c, b, 1)
};
Matrix.prototype.Transform = function(a) {
	return this.PointMultiply(a)
};
Matrix.prototype.ApplyTranslation = function(a) {
	if ((this.NumRows == this.NumColumns) && (this.NumRows == 4)) {
		return new Point(a.x + this.MMatrix[12], a.y + this.MMatrix[13], a.z
				+ this.MMatrix[14])
	} else {
		if ((this.NumRows == this.NumColumns) && (this.NumRows == 3)) {
			return new Point(a.x + this.MMatrix[6], a.y + this.MMatrix[7])
		}
	}
	return a
};
Matrix.prototype.ApplyRotation = function(a) {
	if ((this.NumRows == this.NumColumns) && (this.NumRows == 4)) {
		return new Point((this.MMatrix[0] * a.x) + (this.MMatrix[4] * a.y)
				+ (this.MMatrix[8] * a.z), (this.MMatrix[1] * a.x)
				+ (this.MMatrix[5] * a.y) + (this.MMatrix[9] * a.z),
				(this.MMatrix[2] * a.x) + (this.MMatrix[6] * a.y)
						+ (this.MMatrix[10] * a.z))
	} else {
		if ((this.NumRows == this.NumColumns) && (this.NumRows == 3)) {
			return new Point((this.MMatrix[0] * a.x) + (this.MMatrix[3] * a.y),
					(this.MMatrix[1] * a.x) + (this.MMatrix[4] * a.y))
		}
	}
	return a
};
Matrix.prototype.ApplyScale = function(a) {
	return a * ScaleValue
};
Matrix.prototype.SetIdentity = function() {
	for ( var b = 0; b < this.NumRows; ++b) {
		for ( var a = 0; a < this.NumColumns; ++a) {
			if (a == b) {
				this.MMatrix[b * this.NumColumns + a] = 1
			} else {
				this.MMatrix[b * this.NumColumns + a] = 0
			}
		}
	}
};
Matrix.prototype.GetSize = function() {
	return (this.NumRows * this.NumColumns)
};
Matrix.prototype.GetValue = function(b, a) {
	return this.MMatrix[b * this.NumColumns + a]
};
Matrix.prototype.SetValue = function(c, a, b) {
	this.MMatrix[c * this.NumColumns + a] = b
};
Matrix.prototype.GetTranslation = function() {
	if ((this.NumRows == this.NumColumns) && (this.NumRows == 4)) {
		return new Point(this.MMatrix[12], this.MMatrix[13], this.MMatrix[14])
	} else {
		if ((this.NumRows == this.NumColumns) && (this.NumRows == 3)) {
			return new Point(this.MMatrix[6], this.MMatrix[7])
		}
	}
	return new Point()
};
Matrix.prototype.GetRotation = function() {
	return this.Rotation
};
Matrix.prototype.GetScale = function() {
	return this.ScaleValue
};
Matrix.prototype.GetDirection = function() {
	if ((this.NumRows == this.NumColumns) && (this.NumRows == 4)) {
		return new Point(this.MMatrix[8], this.MMatrix[9], this.MMatrix[10])
	} else {
		if ((this.NumRows == this.NumColumns) && (this.NumRows == 3)) {
			return new Point(this.MMatrix[3], this.MMatrix[4])
		}
	}
	return new Point()
};
Matrix.prototype.GetEulerAngle = function() {
	var b = new Point();
	if ((this.NumRows == this.NumColumns) && (this.NumRows > 2)) {
		var c = 180 / Math.PI;
		b.y = Math.Asin(this.MMatrix[2]);
		var d = Math.cos(b.y);
		b.y *= c;
		var a;
		var e;
		if (Math.abs(d) > 0.005) {
			a = this.MMatrix[10] / d;
			e = -this.MMatrix[6] / d;
			b.x = Math.atan2(e, a) * c;
			a = this.MMatrix[0] / d;
			e = -this.MMatrix[1] / d;
			b.z = Math.atan2(e, a) * c
		} else {
			b.x = 0;
			a = this.MMatrix[5];
			e = this.MMatrix[4];
			b.z = Math.atan2(e, a) * c
		}
		if (b.x < -0.00001) {
			b.x += 360
		}
		if (b.y < -0.00001) {
			b.y += 360
		}
		if (b.z < -0.00001) {
			b.z += 360
		}
	}
	return b
};
Matrix.prototype.GetDeterminant = function() {
	if (this.NumRows == this.NumColumns) {
		return this.GetDeterminant(this, this.NumRows)
	}
	return 0
};
Matrix.prototype.GetScaledMatrix = function() {
	var a = new Matrix(4, 4);
	a.MMatrix[0] = this.ScaleValue.x;
	a.MMatrix[5] = this.ScaleValue.y;
	a.MMatrix[10] = this.ScaleValue.z;
	return a.Multiply(this)
};
function ViewMatrix() {
}
ViewMatrix.Frustum = function(g, d, c, f, e, a) {
	var b = new Matrix(4, 4);
	b.MMatrix[0] = (2 * e) / (d - g);
	b.MMatrix[1] = 0;
	b.MMatrix[2] = 0;
	b.MMatrix[3] = 0;
	b.MMatrix[4] = 0;
	b.MMatrix[5] = (2 * e) / (f - c);
	b.MMatrix[6] = 0;
	b.MMatrix[7] = 0;
	b.MMatrix[8] = (d + g) / (d - g);
	b.MMatrix[9] = (f + c) / (f - c);
	b.MMatrix[10] = -(a + e) / (a - e);
	b.MMatrix[11] = -1;
	b.MMatrix[12] = 0;
	b.MMatrix[13] = 0;
	b.MMatrix[14] = -(2 * a * e) / (a - e);
	b.MMatrix[15] = 0;
	return b
};
ViewMatrix.Orthographic = function(e, a, d, b) {
	var c = new Matrix(4, 4);
	c.MMatrix[0] = 1 / e;
	c.MMatrix[1] = 0;
	c.MMatrix[2] = 0;
	c.MMatrix[3] = 0;
	c.MMatrix[4] = 0;
	c.MMatrix[5] = 1 / a;
	c.MMatrix[6] = 0;
	c.MMatrix[7] = 0;
	c.MMatrix[8] = 0;
	c.MMatrix[9] = 0;
	c.MMatrix[10] = -2 / (b - d);
	c.MMatrix[11] = 0;
	c.MMatrix[12] = 0;
	c.MMatrix[13] = 0;
	c.MMatrix[14] = -d / (b - d);
	c.MMatrix[15] = 1;
	return c
};
ViewMatrix.Perspective = function(b, d, f, a) {
	var h = f * Math.tan(b * (Math.PI / 360));
	var c = -h;
	var g = c * d;
	var e = h * d;
	return this.Frustum(g, e, c, h, f, a)
};
ViewMatrix.ViewPort = function(b, e, d, a) {
	var c = new Matrix(4, 4);
	c.MMatrix[0] = d * 0.5;
	c.MMatrix[1] = 0;
	c.MMatrix[2] = 0;
	c.MMatrix[3] = 0;
	c.MMatrix[4] = 0;
	c.MMatrix[5] = a * 0.5;
	c.MMatrix[6] = 0;
	c.MMatrix[7] = 0;
	c.MMatrix[8] = 0;
	c.MMatrix[9] = 0;
	c.MMatrix[10] = 1;
	c.MMatrix[11] = 0;
	c.MMatrix[12] = b + d * 0.5;
	c.MMatrix[13] = e + a * 0.5;
	c.MMatrix[14] = 0;
	c.MMatrix[15] = 1;
	return c
};
ViewMatrix.Unproject = function(b, d, f, a, c, e, h) {
	var g = a.SlowInverse().Multiply(c);
	b.x = (b.x / d) * 2 - 1;
	b.y = -(((b.y / f) * 2) - 1);
	b.z = 0;
	b.w = 1;
	e = g.MultiplyBy(b);
	e.x /= e.w;
	e.y /= e.w;
	e.z /= e.w;
	e.w = 1;
	b.z = 1;
	h = g.MultiplyBy(b);
	h.x /= h.w;
	h.y /= h.w;
	h.z /= h.w;
	h.w = 1;
	h = (h.Subtract(e)).Normalize()
};
function BezierCurve() {
	this.mPoint = new Array()
}
BezierCurve.prototype.GetBezierCurve = function(a, c) {
	var e = a.length;
	if (e <= 2) {
		return a
	}
	var d = new Array();
	for ( var b = 0; b < (e - 1); ++b) {
		d.push(a[b].Add((a[b + 1].Subtract(a[b]))
				.Multiply(new Point(c, c, c, c))))
	}
	return this.GetBezierCurve(d, c)
};
BezierCurve.prototype.AddPoint = function(a) {
	this.mPoint.push(a)
};
BezierCurve.prototype.InsertPoint = function(a, b) {
	this.mPoint.splice(b, 0, a)
};
BezierCurve.prototype.RemovePoint = function(a) {
	this.mPoint.splice(a, 1)
};
BezierCurve.prototype.GetPoint = function(a) {
	return this.mPoint[a]
};
BezierCurve.prototype.GetCurvePoint = function(b) {
	if (this.mPoint.length > 1) {
		var a = this.GetBezierCurve(this.mPoint, b);
		return a[0].Add((a[1].Subtract(a[0])).Multiply(new Point(b, b, b, b)))
	}
	return new Point()
};
function BezierPoint(b, e, c, d, f, a) {
	this.EndPoint = (b != null) ? b : new Point();
	this.C1 = (e != null) ? e : new Point();
	this.C2 = (d != null) ? d : new Point();
	this.C1Type = (c != null) ? c : false;
	this.C2Type = (f != null) ? f : false;
	this.Radius = (a != null) ? a : new Point()
}
function BezierPath() {
	this.mPoint = new Array();
	this.Loop = false
}
BezierPath.prototype.AddPoint = function(a) {
	this.mPoint.push(a)
};
BezierPath.prototype.InsertPoint = function(a, b) {
	if (b == null) {
		b = this.mPoint.length
	}
	this.mPoint.splice(b, a)
};
BezierPath.prototype.RemovePoint = function(a) {
	this.mPoint.splice(a, 1)
};
BezierPath.prototype.Clear = function() {
	this.mPoint = new Array()
};
BezierPath.prototype.GetPoint = function(a) {
	return this.mPoint[a]
};
BezierPath.prototype.GetNumPoint = function() {
	return this.mPoint.length
};
BezierPath.prototype.GetCurve = function(b) {
	if (b < this.mPoint.length) {
		var a = new BezierCurve();
		a.AddPoint(this.mPoint[b].EndPoint);
		if (this.mPoint[b].C2Type) {
			a.AddPoint(this.mPoint[b].C2)
		}
		++b;
		if (b >= this.mPoint.length) {
			b = 0
		}
		if (this.mPoint[b].C1Type) {
			a.AddPoint(this.mPoint[b].C1)
		}
		a.AddPoint(this.mPoint[b].EndPoint);
		return a
	}
	return new BezierCurve()
};
BezierPath.prototype.GetCurvePointIndex = function(b, c) {
	if (b < this.mPoint.length) {
		var a = this.GetCurve(b);
		return a.GetCurvePoint(c)
	}
	return new Point()
};
BezierPath.prototype.GetCurvePoint = function(d) {
	var b = this.mPoint.length;
	var a = 0;
	if (b > 1) {
		if (!this.Loop) {
			--b
		}
		a = 1 / b;
		var c = Math.floor(b * d);
		if (c == this.mPoint.length) {
			--c
		}
		if (!this.Loop && (c == b)) {
			--c
		}
		d -= (a * c);
		d *= b;
		return this.GetCurvePointIndex(c, d)
	}
	return new Point()
};
BezierPath.prototype.GetCurveRadius = function(d) {
	var b = this.mPoint.length;
	var a = 0;
	if (b > 1) {
		if (!this.Loop) {
			--b
		}
		a = 1 / b;
		var c = Math.floor(b * d);
		d -= (a * c);
		d *= b;
		if (c == b) {
			if (this.Loop) {
				return this.mPoint[0].Radius
			} else {
				return this.mPoint[c].Radius
			}
		} else {
			if ((c + 1) == this.mPoint.length) {
				return new Point(
						this.mPoint[c].Radius.x
								+ ((this.mPoint[0].Radius.x - this.mPoint[c].Radius.x) * d),
						this.mPoint[c].Radius.y
								+ ((this.mPoint[0].Radius.y - this.mPoint[c].Radius.y) * d),
						this.mPoint[c].Radius.z
								+ ((this.mPoint[0].Radius.z - this.mPoint[c].Radius.z) * d))
			} else {
				return new Point(
						this.mPoint[c].Radius.x
								+ ((this.mPoint[c + 1].Radius.x - this.mPoint[c].Radius.x) * d),
						this.mPoint[c].Radius.y
								+ ((this.mPoint[c + 1].Radius.y - this.mPoint[c].Radius.y) * d),
						this.mPoint[c].Radius.z
								+ ((this.mPoint[c + 1].Radius.z - this.mPoint[c].Radius.z) * d))
			}
		}
	}
	return new Point()
};
function Intersect() {
}
Intersect.prototype.PointLine2D = function(c, d, b, e) {
	var a = (c - d) / (b - d);
	if (a.x == a.y) {
		e = a.x;
		return true
	} else {
		if ((a.x == 0) && (a.y != 0)) {
			e = a.y;
			return true
		} else {
			if ((a.y == 0) && (a.x != 0)) {
				e = a.x;
				return true
			}
		}
	}
	return false
};
Intersect.prototype.PointLine = function(e, f, d, g) {
	var a = d.Subract(f);
	var c = a.Magnitude();
	if (c != 0) {
		var b = (e - f).Dot(a) / pow(c, 2);
		if ((b >= 0) && (b <= 1)) {
			g = f + (a * b);
			g.w = g.Distance(e);
			return true
		}
	}
	return false
};
Intersect.prototype.PointTriangle = function(e, g, d, b) {
	var c = (e.y - g.y) * (d.x - g.x) - (e.x - g.x) * (d.y - g.y);
	var f = (e.y - d.y) * (b.x - d.x) - (e.x - d.x) * (b.y - d.y);
	var a = (e.y - b.y) * (g.x - b.x) - (e.x - b.x) * (g.y - b.y);
	if (((c * f) >= 0) && ((f * a) >= 0)) {
		return true
	}
	return false
};
Intersect.prototype.PointPolygon = function(b, n, m, j) {
	var o = false;
	if (m.length > 1) {
		var h = j.Absolute();
		var f;
		var e;
		var l;
		var a;
		if ((h.x >= h.y) && (h.x >= h.z)) {
			var k = new Point(n.y, n.z);
			for ( var g = 0; g < m.length; ++g) {
				if (g < (m.length - 1)) {
					f = g;
					e = g + 1
				} else {
					f = 0;
					e = g
				}
				var d = new Point(m[f].y - b.y, m[f].z - b.z);
				var c = new Point((m[f].y - m[e].y) - b.y, (m[f].z - m[e].z)
						- b.z);
				if (RayRay(l, k, d, c, a)) {
					o = !o
				}
			}
		} else {
			if ((h.y >= h.x) && (h.y >= h.z)) {
				var k = new Point(n.x, n.z);
				for ( var g = 0; g < m.length; ++g) {
					if (g < (m.length - 1)) {
						f = g;
						e = g + 1
					} else {
						f = 0;
						e = g
					}
					var d = new Point(m[f].x - b.x, m[f].z - b.z);
					var c = new Point((m[f].x - m[e].x) - b.x,
							(m[f].z - m[e].z) - b.z);
					if (RayRay(l, k, d, c, a)) {
						o = !o
					}
				}
			} else {
				var k = new Point(n.x, n.y);
				for ( var g = 0; g < m.length; ++g) {
					if (g < (m.length - 1)) {
						f = g;
						e = g + 1
					} else {
						f = 0;
						e = g
					}
					var d = new Point(m[f].x - b.x, m[f].y - b.y);
					var c = new Point((m[f].x - m[e].x) - b.x,
							(m[f].y - m[e].y) - b.y);
					if (RayRay(l, k, d, c, a)) {
						o = !o
					}
				}
			}
		}
	}
	return o
};
Intersect.prototype.PointCube = function(c, b, a) {
	return (Math.abs(c.x - b.x) <= a.x) && (Math.abs(c.y - b.y) <= a.y)
			&& (Math.abs(c.z - b.z) <= a.z)
};
Intersect.prototype.PointSphere = function(c, b, a) {
	return (c.Distance(b) <= a)
};
Intersect.prototype.LineLine = function(g, e, a, i, h) {
	var f = (i.y - a.y) * (e.x - g.x) - (i.x - a.x) * (e.y - g.y);
	if (f != 0) {
		var c = ((i.x - a.x) * (g.y - a.y) - (i.y - a.y) * (g.x - a.x)) / f;
		var b = ((e.x - g.x) * (g.y - a.y) - (e.y - g.y) * (g.x - a.x)) / f;
		if (((c >= 0) && (c <= 1)) && ((b >= 0) && (b <= 1))) {
			h.SetPoint(g + (e - g) * c);
			return true
		}
	}
	return false
};
Intersect.prototype.LinePlane = function(h, f, e, c, a) {
	var g = f - h;
	var b = c.Dot(g);
	if (b != 0) {
		var d = e - h;
		var i = c.Dot(d) / b;
		if ((i >= 0) && (i <= 1)) {
			a = h + (g * i);
			return true
		}
	}
	return false
};
Intersect.prototype.LineBox = function(g, e, b, c) {
	var d = (g + e) * 0.5;
	var f = (e - g);
	var i = b - d;
	var h = f.Magnitude() * 0.5;
	f.Normalize();
	if (Math.abs(i.x) > (c.x + h * Math.abs(f.x))) {
		return false
	}
	if (Math.abs(i.y) > (c.y + h * Math.abs(f.y))) {
		return false
	}
	if (Math.abs(i.z) > (c.z + h * Math.abs(f.z))) {
		return false
	}
	var a = c.y * Math.abs(f.z) + c.z * Math.abs(f.y);
	if (Math.abs(i.y * f.z - i.z * f.y) > a) {
		return false
	}
	a = c.x * Math.abs(f.z) + c.z * Math.abs(f.x);
	if (Math.abs(i.z * f.x - i.x * f.z) > a) {
		return false
	}
	a = c.x * Math.abs(f.y) + c.y * Math.abs(f.x);
	if (Math.abs(i.x * f.y - i.y * f.x) > a) {
		return false
	}
	return true
};
Intersect.prototype.LineSphere = function(o, m, d, j, i, f) {
	var n = (m - o).Normalize();
	var l = o - d;
	var e = -l.Dot(n);
	var c = l.Dot(l) - (j * j);
	var a = (e * e) - c;
	if (a >= 0) {
		a = sqrt(a);
		var h = e - a;
		var g = e + a;
		var b = m.Distance(o);
		if (g < h) {
			var p = h;
			h = g;
			g = p
		}
		var k = false;
		if ((h >= 0) && (h <= b)) {
			i = o + n * h;
			k = true
		}
		if ((g >= 0) && (g <= b)) {
			f = o + n * g;
			k = true
		}
		return k
	}
	return false
};
Intersect.prototype.RayRay = function(j, g, h, f, a) {
	var d = g.Cross(f);
	var b = d.Magnitude();
	if (b == 0) {
		return false
	}
	b *= b;
	var i = h - j;
	var e = new Matrix(3, 3);
	e[0] = i.x;
	e[1] = i.y;
	e[2] = i.z;
	e[3] = f.x;
	e[4] = f.y;
	e[5] = f.z;
	e[6] = d.x;
	e[7] = d.y;
	e[8] = d.z;
	var c = e.GetDeterminant() / b;
	a.SetPoint(j + g * c);
	return true
};
Intersect.prototype.RayPlane = function(g, c, a, f, h) {
	var b = f.Dot(c);
	if (b < 0) {
		var e = -f.Dot(a);
		var d = -(f.Dot(g) + e) / b;
		h.SetPoint(g + (c * d));
		return true
	}
	return false
};
Intersect.prototype.RayTriangle = function(d, m, r, l, k, c) {
	var j = l.Subtract(r);
	var h = k.Subtract(r);
	var f = m.Cross(h);
	var b = f.Dot(j);
	if (b != 0) {
		var g = 1 / b;
		var e = d.Subtract(r);
		var n = g * f.Dot(e);
		if ((n < 0) || (n > 1)) {
			return false
		}
		var a = e.Cross(j);
		var i = g * a.Dot(m);
		if ((i < 0) || ((n + i) > 1)) {
			return false
		}
		var s = g * a.Dot(h);
		c.SetPoint(d + m * s);
		return true
	}
	return false
};
Intersect.prototype.RaySquare = function(g, c, a, f, d, h) {
	if (RayPlane(g, c, a, f, h)) {
		var b = a - h;
		var e = f.Absolute();
		if ((e.x >= e.y) && (e.x >= e.z)) {
			if (((b.y - d.y) <= 0) && ((b.y + d.y) >= 0) && ((b.z - d.z) <= 0)
					&& ((b.z + d.z) >= 0)) {
				return true
			}
		} else {
			if ((e.y >= e.x) && (e.y >= e.z)) {
				if (((b.x - d.x) <= 0) && ((b.x + d.x) >= 0)
						&& ((b.z - d.z) <= 0) && ((b.z + d.z) >= 0)) {
					return true
				}
			} else {
				if (((b.x - d.x) <= 0) && ((b.x + d.x) >= 0)
						&& ((b.y - d.y) <= 0) && ((b.y + d.y) >= 0)) {
					return true
				}
			}
		}
	}
	return false
};
Intersect.prototype.RaySphere = function(e, l, c, j, i, f) {
	var k = e - c;
	var d = -k.Dot(l);
	var b = k.Dot(k) - (j * j);
	var a = (d * d) - b;
	if (a >= 0) {
		a = sqrt(a);
		var h = d - a;
		var g = d + a;
		if ((g >= 0) && ((g < h) || (h < 0))) {
			i.SetPoint(e + l * g);
			f.SetPoint(e + l * h)
		} else {
			if (h >= 0) {
				i.SetPoint(e + l * h);
				f.SetPoint(e + l * g)
			} else {
				return false
			}
		}
		return true
	}
	return false
};
Intersect.prototype.CircleCircle = function(f, n, e, k, d, b) {
	var c = f.Distance(e);
	if (c > (n + k)) {
		return false
	} else {
		if (c <= Math.abs(n - k)) {
			return true
		}
	}
	var m = e - f;
	var j = ((n * n) - (k * k) + (c * c)) / (2 * c);
	var i = sqrt((n * n) - (j * j));
	var g = i / c;
	var l = f + m * (j / c);
	d.SetPoint(l.x - m.y * g, l.y + m.x * g);
	b.SetPoint(l.x + m.y * g, l.y - m.x * g);
	return true
};
Intersect.prototype.SquareSquare = function(c, a, b, d) {
	if (this.PointCube(c, b, d)) {
		return true
	} else {
		if (this.PointCube(a, b, d)) {
			return true
		} else {
			if (this.PointCube(b, c, a)) {
				return true
			} else {
				if (this.PointCube(d, c, a)) {
					return true
				}
			}
		}
	}
	return false
};
Intersect.prototype.AABB = function(c, e, b, d) {
	var a = b - c;
	return (Math.abs(a.x) <= (e.x + d.x)) && (Math.abs(a.y) <= (e.y + d.y))
			&& (Math.abs(a.z) <= (e.z + d.z))
};
Intersect.prototype.AABBSweep = function(p, b, f, o, a, e, u, t) {
	if (this.AABB(p, f, o, e)) {
		u = p;
		t = o;
		return true
	}
	var d = b - p;
	var c = a - o;
	var g = c - d;
	var s = new Point(0, 0, 0);
	var r = new Point(1, 1, 1);
	var n = p - f;
	var m = p + f;
	var l = o - e;
	var k = o + e;
	for ( var q = 0; q < 3; ++q) {
		if ((m[q] < l[q]) && (g[q] < 0)) {
			s[q] = (m[q] - l[q]) / g[q]
		} else {
			if ((k[q] < n[q]) && (g[q] > 0)) {
				s[q] = (n[q] - k[q]) / g[q]
			}
		}
		if ((k[q] > n[q]) && (g[q] < 0)) {
			r[q] = (n[q] - k[q]) / g[q]
		} else {
			if ((m[q] > l[q]) && (g[q] > 0)) {
				r[q] = (m[q] - l[q]) / g[q]
			}
		}
	}
	var h = Math.max(s.x, Math.max(s.y, s.z));
	var j = Math.min(r.x, Math.min(r.y, r.z));
	if (h < j) {
		u = p + d * s;
		t = o + c * s;
		return true
	}
	return false
};
Intersect.prototype.SpherePlaneSweep = function(f, e, g, i, h, c) {
	var a = -h.Dot(i);
	var d = h.Dot(f) + a;
	var b = h.Dot(e) + a;
	if (Math.abs(d) < g) {
		c = f;
		return true
	}
	if ((d > g) && (b < g)) {
		var j = (d - g) / (d - b);
		c = (f * (1 - j)) + (e * j);
		return true
	}
	return false
};
Intersect.prototype.SphereSphere = function(b, d, a, c, e) {
	if (b.Distance(a) <= (d + c)) {
		e = b + ((a - b).Normalize()) * d;
		return true
	}
	return false
};
Intersect.prototype.SphereSphereSweep = function(u, f, j, l, e, i, H, F, m) {
	var h = f - u;
	var g = e - l;
	var n = l - u;
	var k = g - h;
	var G = j + i;
	var E = k.Dot(k);
	var D = 2 * k.Dot(n);
	var C = n.Dot(n) - (G * G);
	if (n.Dot(n) <= (G * G)) {
		m = f + ((e - f).Normalize()) * j;
		return true
	}
	var p = (D * D) - (4 * E * C);
	if (p >= 0) {
		var s = sqrt(p);
		var B = 1 / (2 * E);
		var A = (-D + s) * B;
		var r = (-D - s) * B;
		if (A > r) {
			var o = A;
			A = r;
			r = o
		}
		H = (u + h * A);
		F = (l + g * A);
		m = H + (F - H).Normalize() * j;
		return true
	}
	return false
};
Intersect.prototype.SphereAABB = function(e, f, c, h) {
	var a = 0;
	var j;
	var b = c - h;
	var g = c + h;
	for ( var d = 0; d < 3; ++d) {
		if (e[d] < b[d]) {
			j = e[d] - b[d];
			a += j * j
		} else {
			if (e[d] > g[d]) {
				j = e[d] - g[d];
				a += j * j
			}
		}
	}
	return (a <= (f * f))
};
Intersect.prototype.BarycentricCoordinates = function(e, f, d, c, a) {
	var b = ((f.x - c.x) * (d.y - c.y)) - ((d.x - c.x) * (f.y - c.y));
	if (b == 0) {
		return false
	}
	b = 1 / b;
	a.x = (((d.y - c.y) * (e.x - c.x)) + ((c.x - d.x) * (e.y - c.y))) * b;
	a.y = (((c.y - f.y) * (e.x - c.x)) + ((f.x - c.x) * (e.y - c.y))) * b;
	a.z = 1 - a.x - a.y;
	return true
};
function Perlin() {
	this.mSeed;
	this.mPermutation;
	this.SetSeed(0)
}
Perlin.prototype.Fade = function(a) {
	return a * a * a * (a * (a * 6 - 15) + 10)
};
Perlin.prototype.Lerp = function(e, d, c) {
	return d + e * (c - d)
};
Perlin.prototype.Grad = function(e, a, g, f) {
	var d = e & 15;
	var c = (d < 8) ? a : g;
	var b = (d < 4) ? g : ((d == 12) || (d == 14)) ? a : f;
	return ((d & 1) == 0 ? c : -c) + ((d & 2) == 0 ? b : -b)
};
Perlin.prototype.GetSeed = function() {
};
Perlin.prototype.SetSeed = function(a) {
	var c = new RandomGenerator();
	c.Seed(a);
	this.mSeed = a;
	this.mPermutation = new Array();
	for ( var b = 0; b < 512; ++b) {
		this.mPermutation.push(c.Random(0, 255))
	}
};
Perlin.prototype.GetNoise = function(l, k, j) {
	if (j == null) {
		j = 0
	}
	var f = l > 0 ? Math.floor(l) : Math.floor(l) - 1;
	var c = k > 0 ? Math.floor(k) : Math.floor(k) - 1;
	var a = j > 0 ? Math.floor(j) : Math.floor(j) - 1;
	l -= f;
	k -= c;
	j -= a;
	f &= 255;
	c &= 255;
	a &= 255;
	var o = this.Fade(l);
	var n = this.Fade(k);
	var m = this.Fade(j);
	var e = this.mPermutation[f] + c;
	var i = this.mPermutation[e] + a;
	var h = this.mPermutation[e + 1] + a;
	var b = this.mPermutation[f + 1] + c;
	var g = this.mPermutation[b] + a;
	var d = this.mPermutation[b + 1] + a;
	return this.Lerp(m, this.Lerp(n, this.Lerp(o, this.Grad(
			this.mPermutation[i], l, k, j), this.Grad(this.mPermutation[g],
			l - 1, k, j)), this.Lerp(o, this.Grad(this.mPermutation[h], l,
			k - 1, j), this.Grad(this.mPermutation[d], l - 1, k - 1, j))), this
			.Lerp(n, this.Lerp(o, this.Grad(this.mPermutation[i + 1], l, k,
					j - 1), this
					.Grad(this.mPermutation[g + 1], l - 1, k, j - 1)), this
					.Lerp(o, this.Grad(this.mPermutation[h + 1], l, k - 1,
							j - 1), this.Grad(this.mPermutation[d + 1], l - 1,
							k - 1, j - 1))))
};
var mGrad3 = [ [ 1, 1, 0 ], [ -1, 1, 0 ], [ 1, -1, 0 ], [ -1, -1, 0 ],
		[ 1, 0, 1 ], [ -1, 0, 1 ], [ 1, 0, -1 ], [ -1, 0, -1 ], [ 0, 1, 1 ],
		[ 0, -1, 1 ], [ 0, 1, -1 ], [ 0, -1, -1 ] ];
var mGrad4 = [ [ 0, 1, 1, 1 ], [ 0, 1, 1, -1 ], [ 0, 1, -1, 1 ],
		[ 0, 1, -1, -1 ], [ 0, -1, 1, 1 ], [ 0, -1, 1, -1 ], [ 0, -1, -1, 1 ],
		[ 0, -1, -1, -1 ], [ 1, 0, 1, 1 ], [ 1, 0, 1, -1 ], [ 1, 0, -1, 1 ],
		[ 1, 0, -1, -1 ], [ -1, 0, 1, 1 ], [ -1, 0, 1, -1 ], [ -1, 0, -1, 1 ],
		[ -1, 0, -1, -1 ], [ 1, 1, 0, 1 ], [ 1, 1, 0, -1 ], [ 1, -1, 0, 1 ],
		[ 1, -1, 0, -1 ], [ -1, 1, 0, 1 ], [ -1, 1, 0, -1 ], [ -1, -1, 0, 1 ],
		[ -1, -1, 0, -1 ], [ 1, 1, 1, 0 ], [ 1, 1, -1, 0 ], [ 1, -1, 1, 0 ],
		[ 1, -1, -1, 0 ], [ -1, 1, 1, 0 ], [ -1, 1, -1, 0 ], [ -1, -1, 1, 0 ],
		[ -1, -1, -1, 0 ] ];
var mSimplex = [ [ 0, 1, 2, 3 ], [ 0, 1, 3, 2 ], [ 0, 0, 0, 0 ],
		[ 0, 2, 3, 1 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ],
		[ 1, 2, 3, 0 ], [ 0, 2, 1, 3 ], [ 0, 0, 0, 0 ], [ 0, 3, 1, 2 ],
		[ 0, 3, 2, 1 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ],
		[ 1, 3, 2, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ],
		[ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ],
		[ 0, 0, 0, 0 ], [ 1, 2, 0, 3 ], [ 0, 0, 0, 0 ], [ 1, 3, 0, 2 ],
		[ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 2, 3, 0, 1 ],
		[ 2, 3, 1, 0 ], [ 1, 0, 2, 3 ], [ 1, 0, 3, 2 ], [ 0, 0, 0, 0 ],
		[ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 2, 0, 3, 1 ], [ 0, 0, 0, 0 ],
		[ 2, 1, 3, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ],
		[ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ],
		[ 0, 0, 0, 0 ], [ 2, 0, 1, 3 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ],
		[ 0, 0, 0, 0 ], [ 3, 0, 1, 2 ], [ 3, 0, 2, 1 ], [ 0, 0, 0, 0 ],
		[ 3, 1, 2, 0 ], [ 2, 1, 0, 3 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ],
		[ 0, 0, 0, 0 ], [ 3, 1, 0, 2 ], [ 0, 0, 0, 0 ], [ 3, 2, 0, 1 ],
		[ 3, 2, 1, 0 ] ];
function Simplex() {
	this.mSeed;
	this.mPermutation;
	this.SetSeed(0)
}
Simplex.prototype.Dot2D = function(b, a, c) {
	return (b[0] * a) + (b[1] * c)
};
Simplex.prototype.Dot3D = function(b, a, d, c) {
	return (b[0] * a) + (b[1] * d) + (b[2] * c)
};
Simplex.prototype.Dot4D = function(c, a, e, d, b) {
	return (c[0] * a) + (c[1] * e) + (c[2] * d) + (c[3] * b)
};
Simplex.prototype.GetSeed = function() {
	return this.mSeed
};
Simplex.prototype.SetSeed = function(a) {
	var c = new RandomGenerator();
	c.Seed(a);
	this.mSeed = a;
	this.mPermutation = new Array();
	for ( var b = 0; b < 512; ++b) {
		this.mPermutation.push(c.Random(0, 255))
	}
};
Simplex.prototype.GetNoise = function(a, d, c, b) {
	if ((c != null) && (b != null)) {
		return this.GetNoise4D(a, d, c, b)
	} else {
		if (c != null) {
			return this.GetNoise3D(a, d, c)
		}
	}
	return this.GetNoise2D(a, d)
};
Simplex.prototype.GetNoise2D = function(o, l) {
	var m;
	var h;
	var g;
	var E = 0.366025403;
	var u = (o + l) * E;
	var F = Math.floor(o + u);
	var D = Math.floor(l + u);
	var b = 0.211324865;
	var r = (F + D) * b;
	var K = F - r;
	var f = D - r;
	var J = o - K;
	var e = l - f;
	var C;
	var a;
	if (J > e) {
		C = 1;
		a = 0
	} else {
		C = 0;
		a = 1
	}
	var H = J - C + b;
	var d = e - a + b;
	var G = J - 1 + 2 * b;
	var c = e - 1 + 2 * b;
	var q = F & 255;
	var I = D & 255;
	var B = this.mPermutation[q + this.mPermutation[I]] % 12;
	var A = this.mPermutation[q + C + this.mPermutation[I + a]] % 12;
	var v = this.mPermutation[q + 1 + this.mPermutation[I + 1]] % 12;
	var p = 0.5 - (J * J) - (e * e);
	if (p < 0) {
		m = 0
	} else {
		p *= p;
		m = p * p * this.Dot2D(mGrad3[B], J, e)
	}
	var n = 0.5 - (H * H) - (d * d);
	if (n < 0) {
		h = 0
	} else {
		n *= n;
		h = n * n * this.Dot2D(mGrad3[A], H, d)
	}
	var k = 0.5 - (G * G) - (c * c);
	if (k < 0) {
		g = 0
	} else {
		k *= k;
		g = k * k * this.Dot2D(mGrad3[v], G, c)
	}
	return 70 * (m + h + g)
};
Simplex.prototype.GetNoise3D = function(Q, P, O) {
	var D;
	var C;
	var B;
	var A;
	var G = 1 / 3;
	var T = (Q + P + O) * G;
	var X = Math.floor(Q + T);
	var V = Math.floor(P + T);
	var U = Math.floor(O + T);
	var l = 1 / 6;
	var S = (X + V + U) * l;
	var R = X - S;
	var r = V - S;
	var b = U - S;
	var q = Q - R;
	var a = P - r;
	var N = O - b;
	var d;
	var Y;
	var v;
	var c;
	var W;
	var u;
	if (q >= a) {
		if (a >= N) {
			d = 1;
			Y = 0;
			v = 0;
			c = 1;
			W = 1;
			u = 0
		} else {
			if (q >= N) {
				d = 1;
				Y = 0;
				v = 0;
				c = 1;
				W = 0;
				u = 1
			} else {
				d = 0;
				Y = 0;
				v = 1;
				c = 1;
				W = 0;
				u = 1
			}
		}
	} else {
		if (a < N) {
			d = 0;
			Y = 0;
			v = 1;
			c = 0;
			W = 1;
			u = 1
		} else {
			if (q < N) {
				d = 0;
				Y = 1;
				v = 0;
				c = 0;
				W = 1;
				u = 1
			} else {
				d = 0;
				Y = 1;
				v = 0;
				c = 1;
				W = 1;
				u = 0
			}
		}
	}
	var p = q - d + l;
	var ac = a - Y + l;
	var M = N - v + l;
	var o = q - c + (2 * l);
	var ab = a - W + (2 * l);
	var L = N - u + (2 * l);
	var n = q - 1 + (3 * l);
	var aa = a - 1 + (3 * l);
	var K = N - 1 + (3 * l);
	var I = X & 255;
	var h = V & 255;
	var Z = U & 255;
	var m = this.mPermutation[I + this.mPermutation[h + this.mPermutation[Z]]] % 12;
	var g = this.mPermutation[I + d
			+ this.mPermutation[h + Y + this.mPermutation[Z + v]]] % 12;
	var f = this.mPermutation[I + c
			+ this.mPermutation[h + W + this.mPermutation[Z + u]]] % 12;
	var e = this.mPermutation[I + 1
			+ this.mPermutation[h + 1 + this.mPermutation[Z + 1]]] % 12;
	var J = 0.6 - (q * q) - (a * a) - (N * N);
	if (J < 0) {
		D = 0
	} else {
		J *= J;
		D = J * J * this.Dot3D(mGrad3[m], q, a, N)
	}
	var H = 0.6 - (p * p) - (ac * ac) - (M * M);
	if (H < 0) {
		C = 0
	} else {
		H *= H;
		C = H * H * this.Dot3D(mGrad3[g], p, ac, M)
	}
	var F = 0.6 - (o * o) - (ab * ab) - (L * L);
	if (F < 0) {
		B = 0
	} else {
		F *= F;
		B = F * F * this.Dot3D(mGrad3[f], o, ab, L)
	}
	var E = 0.6 - (n * n) - (aa * aa) - (K * K);
	if (E < 0) {
		A = 0
	} else {
		E *= E;
		A = E * E * this.Dot3D(mGrad3[e], n, aa, K)
	}
	return 32 * (D + C + B + A)
};
Simplex.prototype.GetNoise4D = function(H, E, D, J) {
	var aw;
	var av;
	var au;
	var at;
	var ar;
	var F = 0.309016994;
	var m = 0.138196601;
	var M = (H + E + D + J) * F;
	var W = Math.floor(H + M);
	var V = Math.floor(E + M);
	var U = Math.floor(D + M);
	var S = Math.floor(J + M);
	var L = (W + V + U + S) * m;
	var aa = W - L;
	var C = V - L;
	var h = U - L;
	var ah = S - L;
	var B = H - aa;
	var g = E - C;
	var aH = D - h;
	var T = J - ah;
	var an = (B > g) ? 32 : 0;
	var am = (B > aH) ? 16 : 0;
	var al = (g > aH) ? 8 : 0;
	var ak = (B > T) ? 4 : 0;
	var aj = (g > T) ? 2 : 0;
	var ai = (aH > T) ? 1 : 0;
	var ad = an + am + al + ak + aj + ai;
	var aq;
	var ag;
	var K;
	var p;
	var ap;
	var af;
	var I;
	var o;
	var ao;
	var ae;
	var G;
	var n;
	aq = mSimplex[ad][0] >= 3 ? 1 : 0;
	ag = mSimplex[ad][1] >= 3 ? 1 : 0;
	K = mSimplex[ad][2] >= 3 ? 1 : 0;
	p = mSimplex[ad][3] >= 3 ? 1 : 0;
	ap = mSimplex[ad][0] >= 2 ? 1 : 0;
	af = mSimplex[ad][1] >= 2 ? 1 : 0;
	I = mSimplex[ad][2] >= 2 ? 1 : 0;
	o = mSimplex[ad][3] >= 2 ? 1 : 0;
	ao = mSimplex[ad][0] >= 1 ? 1 : 0;
	ae = mSimplex[ad][1] >= 1 ? 1 : 0;
	G = mSimplex[ad][2] >= 1 ? 1 : 0;
	n = mSimplex[ad][3] >= 1 ? 1 : 0;
	var A = B - aq + m;
	var f = g - ag + m;
	var aG = aH - K + m;
	var R = T - p + m;
	var v = B - ap + 2 * m;
	var e = g - af + 2 * m;
	var aF = aH - I + 2 * m;
	var Q = T - o + 2 * m;
	var u = B - ao + 3 * m;
	var d = g - ae + 3 * m;
	var aE = aH - G + 3 * m;
	var P = T - n + 3 * m;
	var r = B - 1 + 4 * m;
	var b = g - 1 + 4 * m;
	var aD = aH - 1 + 4 * m;
	var O = T - 1 + 4 * m;
	var N = W & 255;
	var q = V & 255;
	var a = U & 255;
	var az = S & 255;
	var ac = this.mPermutation[N
			+ this.mPermutation[q
					+ this.mPermutation[a + this.mPermutation[az]]]] % 32;
	var ab = this.mPermutation[N
			+ aq
			+ this.mPermutation[q + ag
					+ this.mPermutation[a + K + this.mPermutation[az + p]]]] % 32;
	var Z = this.mPermutation[N
			+ ap
			+ this.mPermutation[q + af
					+ this.mPermutation[a + I + this.mPermutation[az + o]]]] % 32;
	var Y = this.mPermutation[N
			+ ao
			+ this.mPermutation[q + ae
					+ this.mPermutation[a + G + this.mPermutation[az + n]]]] % 32;
	var X = this.mPermutation[N
			+ 1
			+ this.mPermutation[q + 1
					+ this.mPermutation[a + 1 + this.mPermutation[az + 1]]]] % 32;
	var aC = 0.6 - B * B - g * g - aH * aH - T * T;
	if (aC < 0) {
		aw = 0
	} else {
		aC *= aC;
		aw = aC * aC * this.Dot4D(mGrad4[ac], B, g, aH, T)
	}
	var aB = 0.6 - A * A - f * f - aG * aG - R * R;
	if (aB < 0) {
		av = 0
	} else {
		aB *= aB;
		av = aB * aB * this.Dot4D(mGrad4[ab], A, f, aG, R)
	}
	var aA = 0.6 - v * v - e * e - aF * aF - Q * Q;
	if (aA < 0) {
		au = 0
	} else {
		aA *= aA;
		au = aA * aA * this.Dot4D(mGrad4[Z], v, e, aF, Q)
	}
	var ay = 0.6 - u * u - d * d - aE * aE - P * P;
	if (ay < 0) {
		at = 0
	} else {
		ay *= ay;
		at = ay * ay * this.Dot4D(mGrad4[Y], u, d, aE, P)
	}
	var ax = 0.6 - r * r - b * b - aD * aD - O * O;
	if (ax < 0) {
		ar = 0
	} else {
		ax *= ax;
		ar = ax * ax * this.Dot4D(mGrad4[X], r, b, aD, O)
	}
	return 27 * (aw + av + au + at + ar)
};
function FBM() {
	this.mNoise = new Perlin()
}
FBM.prototype.GetSeed = function() {
	return this.mNoise.GetSeed()
};
FBM.prototype.SetSeed = function(a) {
	this.mNoise.SetSeed(a)
};
FBM.prototype.GetNoise = function(h, f, e, g, a, b, d) {
	if (g == null) {
		g = 4
	}
	if (a == null) {
		a = 2
	}
	if (b == null) {
		b = 2
	}
	if (d == null) {
		weigth = 0.5
	}
	var k = 0;
	var j = 1;
	for ( var c = 0; c < g; ++c) {
		k += j * this.mNoise.GetNoise(h * a, f * a, e * a);
		j *= d;
		a *= b
	}
	k = 0.5 + k * 0.5;
	return (k < 0 ? 0 : k > 1 ? 1 : k)
};
FBM.prototype.GetTurbulence = function(h, f, e, g, a, b, d) {
	if (g == null) {
		g = 4
	}
	if (a == null) {
		a = 2
	}
	if (b == null) {
		b = 2
	}
	if (d == null) {
		weigth = 0.5
	}
	var k = 0;
	var j = 1;
	for ( var c = 0; c < g; ++c) {
		k += j * Math.abs(this.mNoise.GetNoise(h * a, f * a, e * a));
		j *= d;
		a *= b
	}
	return k > 1 ? 1 : k
};
function RandomGenerator() {
	this.mSeed = 0;
	this.mXorSeed = [ 0, 0, 0, 0 ];
	this.Seed(0)
}
RandomGenerator.prototype.Seed = function(b) {
	this.mSeed = b;
	this.mXorSeed[0] = b;
	for ( var a = 1; a < 4; ++a) {
		this.mXorSeed[a] = (1812433253 * (this.mXorSeed[a - 1] ^ (this.mXorSeed[a - 1] >> 30)) + 5);
		this.mXorSeed[a] &= 4294967295
	}
};
RandomGenerator.prototype.GetSeed = function() {
	return this.mSeed
};
RandomGenerator.prototype.GenerateRandom = function() {
	var a = this.mXorSeed[0] ^ (this.mXorSeed[0] << 11);
	this.mXorSeed[0] = this.mXorSeed[1];
	this.mXorSeed[1] = this.mXorSeed[2];
	this.mXorSeed[2] = this.mXorSeed[3];
	this.mXorSeed[3] = (this.mXorSeed[3] ^ (this.mXorSeed[3] >> 19))
			^ (a ^ (a >> 8));
	return this.mXorSeed[3]
};
RandomGenerator.prototype.Random = function(b, a) {
	if (b == null) {
		b = Number.MIN_VALUE / 2
	}
	if (a == null) {
		a = Number.MAX_VALUE / 2
	}
	return (((a - b) + 1) != 0) ? (b + (this.GenerateRandom() % ((a - b) + 1)))
			: b
};
RandomGenerator.prototype.Probability = function(b, a) {
	if (b == null) {
		b = 0
	}
	if (a == null) {
		a = 1
	}
	return b + (this.GenerateRandom() / 2147483647) * (a - b)
};
function ICommand() {
}
ICommand.prototype.Execute = function(a) {
};
function EventDispatcher(a) {
	this.EventName = a
}
EventDispatcher.prototype.Dispatch = function() {
	var a = Controller.GetAction(this.EventName);
	if (a != null) {
		a.Execute(this)
	}
};
function Controller() {
}
Controller.mControl = new Array();
Controller.Set = function(b, a) {
	this.mControl[b] = a
};
Controller.GetAction = function(a) {
	return this.mControl[a]
};
Controller.GetCondition = function(b) {
	for ( var a in this.mControl.length) {
		if (this.mControl[a] === b) {
			return a
		}
	}
	return null
};
function HttpResponse() {
	this.StatusCode;
	this.ResponseText;
	this.State
}
HttpResponse.XmlDeserialize = function(xmlNode, object) {
	for ( var i = 0; i < xmlNode.childNodes.length; ++i) {
		var child = xmlNode.childNodes.item(i);
		if (child.nodeType == 1) {
			var name = child.nodeName.replace(/:/g, "_");
			eval("if (typeof(object." + name + ") == 'undefined') { object."
					+ name + " = new Array(); }");
			if (child.childNodes.length > 1) {
				var subObject = new Array();
				xmlDeserialize(child, subObject);
				if ((child.attributes != null) && (child.attributes.length > 0)) {
					subObject.attribute = new Object();
					for ( var j = 0; j < child.attributes.length; ++j) {
						eval("subObject.attribute."
								+ child.attributes.item(j).name
								+ "='"
								+ child.attributes.item(j).value.replace(/\'/g,
										"\\'") + "'")
					}
				} else {
					subObject.attribute = null
				}
				eval("object." + name + "[object." + name
						+ ".length] = subObject")
			} else {
				eval("object." + name + "[object." + name
						+ ".length] = new Object()");
				if (child.childNodes.length == 1) {
					eval("object."
							+ name
							+ "[object.length].value = '"
							+ child.childNodes.item(0).data.replace(/\'/g,
									"\\'") + "'")
				} else {
					eval("object." + name + "[object.length].value = null")
				}
				if ((child.attributes != null) && (child.attributes.length > 0)) {
					eval("object." + name
							+ "[object.length].attribute = new Object()");
					for ( var j = 0; j < child.attributes.length; ++j) {
						eval("object."
								+ name
								+ "[object.length].attribute."
								+ child.attributes.item(j).name
								+ "='"
								+ child.attributes.item(j).value.replace(/\'/g,
										"\\'") + "'")
					}
				} else {
					eval("object." + name + "[object.length].attribute = null")
				}
			}
		}
	}
};
function HttpRequest(a) {
	this.mHttp = null;
	this.mDelegate = a;
	this.Url = null;
	this.GET = "GET";
	this.POST = "POST";
	this.HEAD = "HEAD";
	this.PUT = "PUT";
	this.DELETE = "DELETE";
	this.OPTIONS = "OPTIONS";
	this.TRACE = "TRACE";
	this.CONNECT = "CONNECT"
}
HttpRequest.prototype.OnHttpState = function() {
	if ((this.readyState == 4) && (this.Delegate != null)) {
		var a = new HttpResponse();
		a.StatusCode = this.status;
		a.ResponseText = this.responseText;
		a.State = this.State;
		this.Delegate(this, a)
	}
};
HttpRequest.prototype.SendRequest = function(b, a, d, c) {
	this.Cancel();
	this.Url = a;
	this.mHttp = HttpRequest.CreateRequest();
	if (this.mHttp != null) {
		this.mHttp.Delegate = this.mDelegate;
		this.mHttp.State = c;
		this.mHttp.onreadystatechange = this.OnHttpState;
		this.mHttp.open(b, a, true);
		this.mHttp.send(d)
	}
};
HttpRequest.prototype.Cancel = function() {
	if (this.mHttp != null) {
		this.mHttp.abort();
		this.mHttp = null
	}
};
HttpRequest.CreateRequest = function() {
	try {
		return new XMLHttpRequest()
	} catch (a) {
		try {
			return new ActiveXObject("Msxml2.XMLHTTP")
		} catch (a) {
			try {
				return new ActiveXObject("Microsoft.XMLHTTP")
			} catch (a) {
				return null
			}
		}
	}
	return null
};
function Light() {
	this.LightSourceType = {
		Point : 0,
		Area : 1,
		Directional : 2
	};
	this.Enabled = true;
	this.LightType = LightSourceType.Point;
	this.Position = new Point();
	this.Area = new Point();
	this.Samples = 3;
	this.Attenuation = new Point(1, 0, 0);
	this.Direction = new Point();
	this.Cutoff = 45;
	this.Exponent = 1;
	this.Colour = new Point();
	this.CastShadow = true
}
Light.prototype.AttenuationFactor = function(b) {
	var a = Attenuation.x + (Attenuation.y * b) + (Attenuation.y * (b * b));
	if (a > 0) {
		return 1 / a
	}
	return 1
};
function Material() {
	this.Ka = 1;
	this.Ambient = new Point();
	this.Kd = 1;
	this.Diffuse = new Point(0.8, 0.8, 0.8);
	this.Alpha = 1;
	this.Ks = 1;
	this.Specular = new Point();
	this.Ke = 1;
	this.Emission = new Point();
	this.Shininess = 1;
	this.Reflection = 0;
	this.Refraction = 0;
	this.CastShadow = true;
	this.Shadow = 1;
	this.Texture = null;
	this.TextureScale = new Point(1, 1, 1, 1)
}
Material.prototype.GetColour = function(b, a) {
	if (Texture != null) {
		return (Diffuse * Kd)
				* Texture.GetColour(b * TextureScale.x, a * TextureScale.y)
	}
	return Diffuse * Kd
};
function Shape() {
	this.ObjectMaterial = new Material();
	this.ObjectMatrix = new Matrix(4, 4)
}
Shape.prototype.GetPosition = function() {
	return this.ObjectMatrix.GetTranslation()
};
Shape.prototype.GetRotation = function() {
	return this.ObjectMatrix.GetRotation()
};
Shape.prototype.GetScale = function() {
	return this.ObjectMatrix.GetScale()
};
Shape.prototype.SetPosition = function(a, c, b) {
	this.ObjectMatrix.Translate(a, c, b)
};
Shape.prototype.SetRotation = function(a, c, b) {
	this.ObjectMatrix.Rotate(a, c, b)
};
Shape.prototype.SetScale = function(a, c, b) {
	this.ObjectMatrix.Scale(a, c, b)
};
function Particle() {
	this.Mass = 1;
	this.Life = 1;
	this.LifeTime = 0;
	this.Force = new Point();
	this.AngularForce = new Point();
	this.Position = new Point();
	this.Rotation = new Point();
	this.Scale = new Point(1, 1, 1, 0)
}
function ParticleEmitter() {
	this.ParticleCreationGenerator = null;
	this.InitialUpdateGenerator = new Array();
	this.ParticleUpdateGenerator = new Array();
	this.Position = new Point();
	this.Volume = new Point();
	this.SimulationTime = 0;
	this.MaxParticles = 100;
	this.ParticlesPerSecond = 10;
	this.Loop = true;
	this.mParticle = new Array();
	this.mParticleCount = 0;
	this.mNumParticle = 0
}
ParticleEmitter.prototype.Reset = function() {
	this.SimulationTime = 0;
	this.mNumParticle = 0;
	this.mParticle = new Array()
};
ParticleEmitter.prototype.Simulate = function(d) {
	this.SimulationTime += d;
	if (((this.MaxParticles == 0) || (this.mNumParticle < this.MaxParticles))
			&& (this.ParticleCreationGenerator != null)) {
		this.mParticleCount += this.ParticlesPerSecond * d;
		var a = Math.floor(this.mParticleCount);
		if (a > 0) {
			if ((this.mNumParticle + a) >= this.MaxParticles) {
				a = this.MaxParticles - this.mNumParticle;
				this.mParticleCount = 0
			} else {
				this.mParticleCount -= a
			}
			this.mNumParticle += a;
			for ( var c = 0; c < a; ++c) {
				var e = this.ParticleCreationGenerator.Generate(
						this.SimulationTime, this.Position, this.Volume);
				for ( var b = 0; b < this.InitialUpdateGenerator.length; ++b) {
					this.InitialUpdateGenerator[b].Generate(e, 1)
				}
				this.mParticle.push(e)
			}
		}
	}
	for ( var c = 0; c < this.mParticle.length; ++c) {
		var e = this.mParticle[c];
		e.LifeTime += d;
		if (e.LifeTime >= e.Life) {
			this.mParticle.splice(c, 1);
			--c;
			if (this.Loop) {
				--this.mNumParticle
			}
		} else {
			for ( var b = 0; b < this.ParticleUpdateGenerator.length; ++b) {
				this.ParticleUpdateGenerator[b].Generate(e, d)
			}
		}
	}
};
ParticleEmitter.prototype.GetNumParticles = function() {
	return this.mParticle.length
};
function ParticleConstantForceGenerator() {
	this.Force = new Point();
	this.AngularForce = new Point()
}
ParticleConstantForceGenerator.prototype.Generate = function(b, a) {
	b.Force.x += this.Force.x * a;
	b.Force.y += this.Force.y * a;
	b.Force.z += this.Force.z * a;
	b.Force.w += this.Force.w * a;
	b.AngularForce.x += this.AngularForce.x * a;
	b.AngularForce.y += this.AngularForce.y * a;
	b.AngularForce.z += this.AngularForce.z * a;
	b.AngularForce.w += this.AngularForce.w * a
};
function ParticleCreationGenerator() {
	this.mRandom = new RandomGenerator();
	this.MinMass = 1;
	this.MaxMass = 10;
	this.MinLife = 1;
	this.MaxLife = 10;
	this.MinScale = new Point(1, 1, 1);
	this.MaxScale = new Point(1, 1, 1);
	this.LockScale = true
}
ParticleCreationGenerator.prototype.Generate = function(c, a, b) {
	var d = new Particle();
	d.Mass = this.mRandom.Probability(this.MinMass, this.MaxMass);
	d.Life = this.mRandom.Probability(this.MinLife, this.MaxLife);
	d.Scale.x = this.mRandom.Probability(this.MinScale.x, this.MaxScale.x);
	if (this.LockScale) {
		d.Scale.y = d.Scale.x;
		d.Scale.z = d.Scale.x
	} else {
		d.Scale.y = this.mRandom.Probability(this.MinScale.y, this.MaxScale.y);
		d.Scale.z = this.mRandom.Probability(this.MinScale.z, this.MaxScale.z)
	}
	d.Position.x = this.mRandom.Probability(a.x, a.x + b.x);
	d.Position.y = this.mRandom.Probability(a.y, a.y + b.y);
	d.Position.z = this.mRandom.Probability(a.z, a.z + b.z);
	return d
};
function ParticleForceGenerator() {
	this.mRandom = new RandomGenerator();
	this.MinForce = new Point();
	this.MaxForce = new Point();
	this.MinAngularForce = new Point();
	this.MaxAngularForce = new Point()
}
ParticleForceGenerator.prototype.Generate = function(b, a) {
	b.Force.x += this.mRandom.Probability(this.MinForce.x, this.MaxForce.x) * a;
	b.Force.y += this.mRandom.Probability(this.MinForce.y, this.MaxForce.y) * a;
	b.Force.z += this.mRandom.Probability(this.MinForce.z, this.MaxForce.z) * a;
	b.Force.w += this.mRandom.Probability(this.MinForce.w, this.MaxForce.w) * a;
	b.AngularForce.x += this.mRandom.Probability(this.MinAngularForce.x,
			this.MaxAngularForce.x)
			* a;
	b.AngularForce.y += this.mRandom.Probability(this.MinAngularForce.y,
			this.MaxAngularForce.y)
			* a;
	b.AngularForce.z += this.mRandom.Probability(this.MinAngularForce.z,
			this.MaxAngularForce.z)
			* a;
	b.AngularForce.w += this.mRandom.Probability(this.MinAngularForce.w,
			this.MaxAngularForce.w)
			* a
};
function ParticleUpdateGenerator() {
}
ParticleUpdateGenerator.prototype.Generate = function(b, a) {
	b.Position.x += b.Force.x;
	b.Position.y += b.Force.y;
	b.Position.z += b.Force.z;
	b.Position.w += b.Force.w;
	b.Rotation.x += b.AngularForce.x;
	b.Rotation.y += b.AngularForce.y;
	b.Rotation.z += b.AngularForce.z;
	b.Rotation.w += b.AngularForce.w
};
function Vertex() {
	this.VertexPoint = new Point();
	this.UV = new Point();
	this.Normal = new Point();
	this.Colour = new Point()
}
function Polygon() {
	Shape.call(this);
	this.VertexPoint = null;
	this.UV = null;
	this.Normal = null;
	this.Colour = null
}
Polygon.prototype = new Shape();
Polygon.prototype.constructor = Polygon;
Polygon.prototype.Create = function(a) {
	this.VertexPoint = new Array(a * 3);
	this.UV = new Array(a * 2);
	this.Normal = new Array(a * 3)
};
Polygon.prototype.CreatePlanarUV = function(b) {
	if (this.VertexPoint != null) {
		var c = VertexPoint.length;
		var h;
		var g;
		this.GetBoundingBox(h, g);
		var e = h - g;
		var a = g * 2;
		var f = 0;
		for ( var d = 0; d < c; d += 3) {
			if (b == 0) {
				if (this.Normal[d + 2] > 0) {
					this.UV[f] = ((this.VertexPoint[d] - e.x) / a.x)
				} else {
					this.UV[f] = 1 - ((this.VertexPoint[d] - e.x) / a.x)
				}
				this.UV[f + 1] = (this.VertexPoint[d + 1] - e.y) / a.y
			} else {
				if (b == 1) {
					if (this.Normal[d] > 0) {
						this.UV[f] = ((this.VertexPoint[d + 1] - e.y) / a.y)
					} else {
						this.UV[f] = 1 - ((this.VertexPoint[d + 1] - e.y) / a.y)
					}
					this.UV[f + 1] = (this.VertexPoint[d + 2] - e.z) / a.z
				} else {
					if (b == 2) {
						if (this.Normal[d + 1] > 0) {
							this.UV[f] = ((this.VertexPoint[d] - e.x) / a.x)
						} else {
							this.UV[f] = 1 - ((this.VertexPoint[d] - e.x) / a.x)
						}
						this.UV[f + 1] = (this.VertexPoint[d + 2] - e.z) / a.z
					}
				}
			}
			f += 2
		}
	}
};
Polygon.prototype.GetBoundingBox = function(f, e) {
	if (this.VertexPoint != null) {
		var d = Point.Length;
		var c = new Point(1000000, 1000000, 1000000);
		var a = new Point(-1000000, -1000000, -1000000);
		for ( var b = 0; b < d; b += 3) {
			if (this.VertexPoint[b] < c.x) {
				c.x = this.VertexPoint[b]
			}
			if (this.VertexPoint[b] > a.x) {
				a.x = this.VertexPoint[b]
			}
			if (this.VertexPoint[b + 1] < c.y) {
				c.y = this.VertexPoint[b + 1]
			}
			if (this.VertexPoint[b + 1] > a.y) {
				a.y = this.VertexPoint[b + 1]
			}
			if (this.VertexPoint[b + 2] < c.z) {
				c.z = this.VertexPoint[b + 2]
			}
			if (this.VertexPoint[b + 2] > a.z) {
				a.z = this.VertexPoint[b + 2]
			}
		}
		f = c.Add(a).Multiply(0.5);
		e = a.Subtract(f)
	} else {
		f = new Point();
		e = new Point()
	}
};
Polygon.prototype.GetPoint = function(a) {
	a *= 3;
	if ((a + 2) < this.VertexPoint.length) {
		return new Point(this.VertexPoint[a], this.VertexPoint[a + 1],
				this.VertexPoint[a + 2])
	}
	return null
};
Polygon.prototype.GetTransformedPoint = function(a) {
	a *= 3;
	if ((a + 2) < this.VertexPoint.length) {
		return this.GetPosition().Add(
				this.GetScale().Multiply(
						this.ObjectMatrix.ApplyRotation(new Point(
								this.VertexPoint[a], this.VertexPoint[a + 1],
								this.VertexPoint[a + 2]))))
	}
	return null
};
Polygon.prototype.SetPoint = function(b, a) {
	b *= 3;
	if ((b + 2) < this.VertexPoint.length) {
		this.VertexPoint[b] = a.x;
		this.VertexPoint[b + 1] = a.y;
		this.VertexPoint[b + 2] = a.z
	}
};
Polygon.prototype.GetUV = function(a) {
	a *= 2;
	if ((a + 1) < this.UV.length) {
		return new Point(this.UV[a], this.UV[a + 1])
	}
	return null
};
Polygon.prototype.SetUV = function(a, b) {
	a *= 2;
	if ((a + 1) < this.UV.length) {
		this.UV[a] = b.x;
		this.UV[a + 1] = b.y
	}
};
Polygon.prototype.GetNormal = function() {
	if (this.VertexPoint.length >= 9) {
		var d = this.GetPoint(0);
		var b = this.GetPoint(1);
		var a = this.GetPoint(2);
		var e = b.Subtract(d);
		var c = d.Subtract(a);
		return e.Cross(c).Normalize()
	}
	return null
};
Polygon.prototype.GetTransformedNormal = function() {
	var a = this.GetNormal();
	if (a != null) {
		return this.ObjectMatrix.ApplyRotation(a)
	}
	return null
};
Polygon.prototype.GetNormal = function(a) {
	a *= 3;
	if ((a + 2) < this.Normal.length) {
		return new Point(this.Normal[a], this.Normal[a + 1], this.Normal[a + 2])
	}
	return null
};
Polygon.prototype.GetTransformedNormal = function(a) {
	var b = this.GetNormal(a);
	if (b != null) {
		return this.ObjectMatrix.ApplyRotation(b)
	}
	return null
};
Polygon.prototype.GetVertex = function(a) {
	var b = new Vertex();
	b.Point = this.GetPoint(a);
	b.UV = this.GetUV(a);
	b.Normal = this.GetNormal(a);
	return b
};
Polygon.prototype.GetTransformedVertex = function(a) {
	var b = new Vertex();
	b.Point = this.GetTransformedPoint(a);
	b.UV = this.GetUV(a);
	b.Normal = this.GetTransformedNormal(a);
	return b
};
Polygon.prototype.SetNormal = function(a, b) {
	a *= 3;
	if ((a + 2) < this.Normal.length) {
		this.Normal[a] = b.x;
		this.Normal[a + 1] = b.y;
		this.Normal[a + 2] = b.z
	}
};
Polygon.prototype.SetVertex = function(b, a, d, e) {
	var c = b * 2;
	b *= 3;
	if (b < this.VertexPoint.length) {
		this.VertexPoint[b] = a.x;
		this.VertexPoint[b + 1] = a.y;
		this.VertexPoint[b + 2] = a.z;
		this.UV[c] = d.x;
		this.UV[c + 1] = d.y;
		this.Normal[b] = e.x;
		this.Normal[b + 1] = e.y;
		this.Normal[b + 2] = e.z
	}
};
Polygon.prototype.GetNumPoints = function() {
	if (this.VertexPoint != null) {
		return this.VertexPoint.length / 3
	}
	return 0
};
function PolygonGroup() {
	this.Name = null;
	this.StartIndex = 0;
	this.Count = 0
}
function PolygonMesh() {
	Polygon.call(this);
	this.Index = null;
	this.Group = new Array()
}
PolygonMesh.prototype = new Polygon();
PolygonMesh.prototype.constructor = PolygonMesh;
PolygonMesh.prototype.Create = function(a, b) {
	Polygon.prototype.Create.call(this, a);
	if (b > 0) {
		this.Index = new Array(b)
	} else {
		this.Index = null
	}
};
PolygonMesh.prototype.CreatePlanarUV = function(e, k, g) {
	if ((this.VertexPoint != null) && this.Index) {
		var d = k + g;
		if (d > this.Index.length) {
			d = this.Index.length
		}
		var a;
		var j;
		GetBoundingBox(a, j, k, g);
		var b = a - j;
		var h = j * 2;
		var f = 0;
		var l = 0;
		for ( var c = k; c < d; ++c) {
			f = this.Index[c] * 3;
			l = this.Index[c] * 2;
			if (e == 0) {
				if (this.Normal[f + 2] > 0) {
					this.UV[l + 0] = ((this.VertexPoint[f + 0] - b.x) / h.x)
				} else {
					this.UV[l + 0] = 1 - ((this.VertexPoint[f + 0] - b.x) / h.x)
				}
				this.UV[l + 1] = (this.VertexPoint[f + 1] - b.y) / h.y
			} else {
				if (e == 1) {
					if (this.Normal[f] > 0) {
						this.UV[l] = ((this.VertexPoint[f + 1] - b.y) / h.y)
					} else {
						this.UV[l] = 1 - ((this.VertexPoint[f + 1] - b.y) / h.y)
					}
					this.UV[l + 1] = (this.VertexPoint[f + 2] - b.z) / h.z
				} else {
					if (e == 2) {
						if (this.Normal[f + 1] > 0) {
							this.UV[l] = ((this.VertexPoint[f] - b.x) / h.x)
						} else {
							this.UV[l] = 1 - ((this.VertexPoint[f] - b.x) / h.x)
						}
						this.UV[l + 1] = (this.VertexPoint[f + 2] - b.z) / h.z
					}
				}
			}
		}
	}
};
PolygonMesh.prototype.CreateNormals = function() {
	var g = 0;
	if (this.Index != null) {
		g = this.Index.length
	} else {
		g = this.GetNumPoints() * 3
	}
	var m = this.GetNumPoints() * 3;
	for ( var d = 0; d < m; ++d) {
		this.Normal[d] = 0
	}
	for ( var d = 0; d < g; d += 3) {
		var c = this.GetIndex(d);
		var b = this.GetIndex(d + 1);
		var a = this.GetIndex(d + 2);
		var n = this.GetPoint(c);
		var l = this.GetPoint(b);
		var k = this.GetPoint(a);
		var j = n.Subtract(l);
		var h = k.Subtract(l);
		var f = j.Cross(h);
		this.SetNormal(c, this.GetNormal(c).Add(f));
		this.SetNormal(b, this.GetNormal(b).Add(f));
		this.SetNormal(a, this.GetNormal(a).Add(f))
	}
	for ( var d = 0; d < g; ++d) {
		var e = this.GetIndex(d);
		this.SetNormal(e, this.GetNormal(e).Normalize())
	}
};
PolygonMesh.prototype.WeldVertices = function(e) {
	if (e == null) {
		e = 0.00001
	}
	var c = 0;
	for ( var b = 0; b < this.Index.length; ++b) {
		var d = this.GetPoint(this.Index[b]);
		for ( var a = (b + 1); a < this.Index.length; ++a) {
			if ((this.Index[b] != this.Index[a])
					&& ((d - this.GetPoint(this.Index[a])).Magnitude() < e)) {
				this.Index[a] = this.Index[b];
				++c
			}
		}
	}
	return c
};
PolygonMesh.prototype.GetBoundingBox = function(a, h, j, f) {
	if ((this.VertexPoint != null) && (this.Index != null)) {
		var d = j + f;
		if (d > this.Index.length) {
			d = this.Index.length
		}
		var b = new Point(1000000, 1000000, 1000000);
		var g = new Point(-1000000, -1000000, -1000000);
		for ( var c = j; c < d; ++c) {
			var e = this.Index[c] * 3;
			if (this.VertexPoint[e + 0] < b.x) {
				b.x = this.VertexPoint[e + 0]
			}
			if (this.VertexPoint[e + 0] > g.x) {
				g.x = this.VertexPoint[e + 0]
			}
			if (this.VertexPoint[e + 1] < b.y) {
				b.y = this.VertexPoint[e + 1]
			}
			if (this.VertexPoint[e + 1] > g.y) {
				g.y = this.VertexPoint[e + 1]
			}
			if (this.VertexPoint[e + 2] < b.z) {
				b.z = this.VertexPoint[e + 2]
			}
			if (this.VertexPoint[e + 2] > g.z) {
				g.z = this.VertexPoint[e + 2]
			}
		}
		a = b.Add(g).Multiply(0.5);
		h = g.Subtract(a)
	} else {
		a = new Point();
		h = new Point()
	}
};
PolygonMesh.prototype.GetIndex = function(a) {
	if (this.Index != null) {
		return this.Index[a]
	}
	return a
};
PolygonMesh.prototype.GetPolygon = function(b, f) {
	var d = new Polygon();
	d.Create(f);
	d.SetPosition(this.GetPosition());
	d.SetRotation(this.GetRotation());
	d.SetScale(this.GetScale());
	for ( var c = 0; c < f; ++c) {
		var g;
		var a;
		if (this.Index != null) {
			g = this.Index[b + c] * 3;
			a = this.Index[b + c] * 2
		} else {
			g = (b + c) * 3;
			a = (b + c) * 2
		}
		var h = c * 3;
		var e = c * 2;
		d.VertexPoint[h] = this.VertexPoint[g];
		d.VertexPoint[h + 1] = this.VertexPoint[g + 1];
		d.VertexPoint[h + 2] = this.VertexPoint[g + 2];
		d.UV[e] = this.UV[a];
		d.UV[e + 1] = this.UV[a + 1];
		d.Normal[h] = this.Normal[g];
		d.Normal[h + 1] = this.Normal[g + 1];
		d.Normal[h + 2] = this.Normal[g + 2]
	}
	return d
};
PolygonMesh.prototype.SetPolygon = function(b, d) {
	for ( var c = 0; c < d.NumPoints; ++c) {
		var f = c * 3;
		var a = c * 2;
		var g;
		var e;
		if (this.Index != null) {
			g = this.Index[b + c] * 3;
			e = this.Index[b + c] * 2
		} else {
			g = (b + c) * 3;
			e = (b + c) * 2
		}
		this.VertexPoint[g] = d.VertexPoint[f];
		this.VertexPoint[g + 1] = d.VertexPoint[f + 1];
		this.VertexPoint[g + 2] = d.VertexPoint[f + 2];
		this.UV[e] = d.UV[a];
		this.UV[e + 1] = d.UV[a + 1];
		this.Normal[g] = d.Normal[f];
		this.Normal[g + 1] = d.Normal[f + 1];
		this.Normal[g + 2] = d.Normal[f + 2]
	}
};
PolygonMesh.prototype.GetNumIndices = function() {
	if (this.Index != null) {
		return this.Index.length
	}
	return 0
};
function BezierPathMesh() {
	PolygonMesh.call(this);
	this.Path = new Array();
	this.mNumRings = 0;
	this.mNumSegments = 0
}
BezierPathMesh.prototype = new PolygonMesh();
BezierPathMesh.prototype.constructor = BezierPathMesh;
BezierPathMesh.prototype.Create = function(r, n) {
	var q = this.Path.length;
	if (q > 0) {
		this.mNumRings = n;
		this.mNumSegments = r;
		var E = this.Path[q - 1].Loop;
		PolygonMesh.prototype.Create.call(this, n * r * q, (E ? n : n - 1)
				* (r - 1) * 6 * q);
		var g = 0;
		var h = 0;
		var l = new Point();
		for ( var B = 0; B < q; ++B) {
			var m = new PolygonGroup();
			m.StartIndex = h;
			m.Name = "g" + (B + 1).toString();
			this.Group.push(m);
			for ( var A = 0; A < n; ++A) {
				var d = this.Path[B].Loop ? n : n - 1;
				var b = this.Path[B].GetCurvePoint(A / d);
				var a = this.Path[B].GetCurvePoint((A + 1) / d);
				var f = this.Path[B].GetCurveRadius(A / d);
				var F = (a.Subtract(b)).Normalize();
				var o;
				if ((Math.abs(F.y) < Math.abs(F.x))
						&& (Math.abs(F.y) < Math.abs(F.z))) {
					o = new Point(0, 1, 0)
				} else {
					if ((Math.abs(F.x) < Math.abs(F.y))
							&& (Math.abs(F.x) < Math.abs(F.z))) {
						o = new Point(1, 0, 0)
					} else {
						o = new Point(0, 0, 1)
					}
				}
				var p = F.Cross(o).Normalize();
				o = p.Cross(F);
				l.y = A / (n - 1);
				for ( var t = 0; t < r; ++t) {
					var C = (t / (r - 1)) * (2 * Math.PI);
					var G = Math.cos(C);
					var e = Math.sin(C);
					var D = new Point(p.x * G + o.x * e, p.y * G + o.y * e, p.z
							* G + o.z * e);
					var s = new Point(b.x + f.x * D.x, b.y + f.y * D.y, b.z
							+ f.z * D.z);
					this.SetPoint(g, s);
					l.x = t / (r - 1);
					this.SetUV(g, l);
					if ((A < (n - 1)) && (t < (r - 1))) {
						this.Index[h] = g;
						this.Index[h + 1] = g + r;
						this.Index[h + 2] = g + 1 + r;
						this.Index[h + 3] = g + 1 + r;
						this.Index[h + 4] = g + 1;
						this.Index[h + 5] = g;
						h += 6
					} else {
						if (this.Path[B].Loop && (t < (r - 1))) {
							this.Index[h] = g;
							this.Index[h + 1] = t;
							this.Index[h + 2] = t + 1;
							this.Index[h + 3] = t + 1;
							this.Index[h + 4] = g + 1;
							this.Index[h + 5] = g;
							h += 6
						}
					}
					++g
				}
			}
			m.Count = h - m.StartIndex
		}
		this.CreateNormals()
	}
};
BezierPathMesh.prototype.Update = function() {
	var A = this.Path.length;
	if (A > 0) {
		var n = 0;
		for ( var g = 0; g < A; ++g) {
			for ( var f = 0; f < this.mNumRings; ++f) {
				var d = this.Path[g].Loop ? this.mNumRings : this.mNumRings - 1;
				var t = this.Path[g].GetCurvePoint(f / d);
				var r = this.Path[g].GetCurvePoint((f + 1) / d);
				var h = this.Path[g].GetCurveRadius(f / d);
				var l = (r.Subtract(t)).Normalize();
				var q;
				if ((Math.abs(l.y) < Math.abs(l.x))
						&& (Math.abs(l.y) < Math.abs(l.z))) {
					q = new Point(0, 1, 0)
				} else {
					if ((Math.abs(l.x) < Math.abs(l.y))
							&& (Math.abs(l.x) < Math.abs(l.z))) {
						q = new Point(1, 0, 0)
					} else {
						q = new Point(0, 0, 1)
					}
				}
				var s = l.Cross(q).Normalize();
				q = s.Cross(l);
				for ( var e = 0; e < this.mNumSegments; ++e) {
					var b = (e / (this.mNumSegments - 1)) * (2 * Math.PI);
					var o = Math.cos(b);
					var a = Math.sin(b);
					var m = new Point(s.x * o + q.x * a, s.y * o + q.y * a, s.z
							* o + q.z * a);
					var p = new Point(t.x + h.x * m.x, t.y + h.y * m.y, t.z
							+ h.z * m.z);
					this.SetPoint(n, p);
					++n
				}
			}
		}
		this.CreateNormals()
	}
};
function Heightmap() {
	PolygonMesh.call(this);
	this.Width = 0;
	this.Height = 0;
	this.StartPoint = new Point();
	this.NoiseSeed = 0;
	this.NoiseNumIteration = 4;
	this.NoiseScale = 2;
	this.NoiseMultiplier = 2;
	this.NoiseWeight = 0.5
}
Heightmap.prototype = new PolygonMesh();
Heightmap.prototype.constructor = Heightmap;
Heightmap.prototype.CreateHeightmap = function(d) {
	var a = d.GetWidth();
	var n = d.GetHeight();
	var f = d.GetNumChannel();
	if (f == 4) {
		f = 3
	}
	PolygonMesh.prototype.Create.call(this, a * n, (a - 1) * (n - 1) * 6);
	this.Width = a;
	this.Height = n;
	var b;
	var m;
	var h = 0;
	var g = 0;
	var c = 255 * f;
	var l = new Point();
	for ( var j = 0; j < n; ++j) {
		for ( var k = 0; k < a; ++k) {
			l.x = k / (a - 1);
			l.z = j / (n - 1);
			b = d.GetPixel(k, j);
			m = 0;
			for ( var e = 0; e < f; ++e) {
				m += b[e]
			}
			l.y = m / c;
			this.SetPoint(h, l);
			this.SetUV(h, new Point(l.x, l.z));
			if ((j < (n - 1)) && (k < (a - 1))) {
				this.Index[g + 0] = h;
				this.Index[g + 1] = h + a;
				this.Index[g + 2] = h + 1 + a;
				this.Index[g + 3] = h + 1 + a;
				this.Index[g + 4] = h + 1;
				this.Index[g + 5] = h;
				g += 6
			}
			++h
		}
	}
	this.CreateNormals()
};
Heightmap.prototype.Create = function(e, c) {
	var f = new FBM();
	f.SetSeed(this.NoiseSeed);
	PolygonMesh.prototype.Create.call(this, e * c, (e - 1) * (c - 1) * 6);
	this.Width = e;
	this.Height = c;
	var g = 0;
	var d = 0;
	var b = new Point();
	for ( var h = 0; h < c; ++h) {
		for ( var a = 0; a < e; ++a) {
			b.x = a / (e - 1);
			b.z = h / (c - 1);
			b.y = f.GetNoise(this.StartPoint.x + b.x, this.StartPoint.y + b.z,
					this.StartPoint.z, this.NoiseNumIteration, this.NoiseScale,
					this.NoiseMultiplier, this.NoiseWeight);
			this.SetPoint(g, b);
			this.SetUV(g, new Point(b.x, b.z));
			if ((h < (c - 1)) && (a < (e - 1))) {
				this.Index[d + 0] = g;
				this.Index[d + 1] = g + e;
				this.Index[d + 2] = g + 1 + e;
				this.Index[d + 3] = g + 1 + e;
				this.Index[d + 4] = g + 1;
				this.Index[d + 5] = g;
				d += 6
			}
			++g
		}
	}
	this.CreateNormals()
};
Heightmap.prototype.GetFloor = function(m, k) {
	m = (m < 0) ? 0 : (m > 1) ? 1 : m;
	k = (k < 0) ? 0 : (k > 1) ? 1 : k;
	var b = (m >= 1) ? Width - 2 : Math.floor(m / (1 / (Width - 1)));
	var i = (k >= 1) ? Height - 2 : Math.floor(k / (1 / (Height - 1)));
	var j = (b + i * (Width - 1)) * 6;
	var h = Index[j + 0] * 3;
	var g = Index[j + 1] * 3;
	var f = Index[j + 2] * 3;
	var e = Index[j + 4] * 3;
	var r = new Point(this.VertexPoint[h + 0], this.VertexPoint[h + 1],
			this.VertexPoint[h + 2]);
	var q = new Point(this.VertexPoint[g + 0], this.VertexPoint[g + 1],
			this.VertexPoint[g + 2]);
	var n = new Point(this.VertexPoint[f + 0], this.VertexPoint[f + 1],
			this.VertexPoint[f + 2]);
	var l = new Point(this.VertexPoint[e + 0], this.VertexPoint[e + 1],
			this.VertexPoint[e + 2]);
	var a = new Point(m, r.y + 1, k);
	var o = new Point(0, -1, 0);
	var c = new Point();
	var d = new Intersect();
	if (d.RayTriangle(a, o, r, q, n, c)) {
		return c.y
	} else {
		if (d.RayTriangle(a, o, n, l, r, c)) {
			return c.y
		}
	}
	return 0
};
function Circle(b, a) {
	PolygonMesh.call(this);
	this.Create(b + 1, b * 3);
	this.SetPoint(0, new Point(0, 0));
	this.SetUV(0, new Point(0.5, 0.5));
	for ( var c = 0; c < b; ++c) {
		var d = (c / b) * (2 * Math.PI);
		this.SetPoint(c + 1, new Point(Math.cos(d) * a, Math.sin(d) * a, 0));
		this.SetUV(c + 1, new Point((Math.cos(d) + 1) * 0.5,
				(Math.sin(d) + 1) * 0.5));
		this.Index[c * 3 + 0] = 0;
		if (c == (b - 1)) {
			this.Index[c * 3 + 1] = c + 1;
			this.Index[c * 3 + 2] = 1
		} else {
			this.Index[c * 3 + 1] = c + 1;
			this.Index[c * 3 + 2] = c + 2
		}
	}
	this.CreateNormals()
}
function CircleCutoff(l, h, f, a) {
	PolygonMesh.call(this);
	a = 1 - a;
	var j = a != 0;
	if ((l % 2) != 0) {
		++l
	}
	this.Create(l, (l - 2) * 3);
	a = a < 0 ? 0 : a > 1 ? 1 : a;
	a *= 2;
	var d = 0.5 - ((h / f) * 0.5);
	for ( var e = 0; e < l; e += 2) {
		var b = j ? (e / (l - 2)) * (a * Math.PI) : (e / l) * (a * Math.PI);
		var m = new Point(Math.cos(b) * h, Math.sin(b) * h);
		var k = new Point(Math.cos(b) * f, Math.sin(b) * f);
		this.SetPoint(e, m);
		this.SetPoint(e + 1, k);
		var g = new Point((Math.cos(b) + 1) * 0.5, (Math.sin(b) + 1) * 0.5);
		var c = k.Subtract(m).Normalize();
		c.x = g.x - c.x * d;
		c.y = g.y - c.y * d;
		this.SetUV(e, c);
		this.SetUV(e + 1, g);
		if (e < (l - 2)) {
			this.Index[e * 3 + 0] = e;
			this.Index[e * 3 + 1] = e + 1;
			this.Index[e * 3 + 2] = e + 3;
			this.Index[e * 3 + 3] = e + 3;
			this.Index[e * 3 + 4] = e + 2;
			this.Index[e * 3 + 5] = e
		}
	}
	this.CreateNormals()
}
Circle.prototype = new PolygonMesh();
Circle.prototype.constructor = Circle;
CircleCutoff.prototype = new PolygonMesh();
CircleCutoff.prototype.constructor = CircleCutoff;
function Cone(c, b, a) {
	PolygonMesh.call(this);
	this.Create(c + 1, c * 3);
	this.SetPoint(0, new Point(0, 0, a));
	this.SetUV(0, new Point(0.5, 0.5));
	for ( var d = 0; d < c; ++d) {
		var e = (d / c) * (2 * Math.PI);
		this.SetPoint(d + 1, new Point(Math.cos(e) * b, Math.sin(e) * b));
		this.SetUV(d + 1, new Point((Math.cos(e) + 1) * 0.5,
				(Math.sin(e) + 1) * 0.5));
		this.Index[d * 3 + 0] = 0;
		if (d == (c - 1)) {
			this.Index[d * 3 + 1] = d + 1;
			this.Index[d * 3 + 2] = 1
		} else {
			this.Index[d * 3 + 1] = d + 1;
			this.Index[d * 3 + 2] = d + 2
		}
	}
	this.CreateNormals()
}
Cone.prototype = new PolygonMesh();
Cone.prototype.constructor = Cone;
function Cube(a, c, b) {
	PolygonMesh.call(this);
	this.Create(8 + 2 + 2, 12 * 3);
	this.SetPoint(0, new Point(-a, -c, -b));
	this.SetPoint(1, new Point(a, -c, -b));
	this.SetPoint(2, new Point(a, c, -b));
	this.SetPoint(3, new Point(-a, c, -b));
	this.SetPoint(4, new Point(-a, -c, b));
	this.SetPoint(5, new Point(a, -c, b));
	this.SetPoint(6, new Point(a, c, b));
	this.SetPoint(7, new Point(-a, c, b));
	this.SetPoint(8, new Point(-a, c, b));
	this.SetPoint(9, new Point(a, c, b));
	this.SetPoint(10, new Point(-a, -c, b));
	this.SetPoint(11, new Point(a, -c, b));
	this.SetUV(0, new Point(0, 0));
	this.SetUV(1, new Point(1, 0));
	this.SetUV(2, new Point(1, 1));
	this.SetUV(3, new Point(0, 1));
	this.SetUV(4, new Point(1, 0));
	this.SetUV(5, new Point(0, 0));
	this.SetUV(6, new Point(0, 1));
	this.SetUV(7, new Point(1, 1));
	this.SetUV(8, new Point(0, 0));
	this.SetUV(9, new Point(1, 0));
	this.SetUV(10, new Point(0, 1));
	this.SetUV(11, new Point(1, 1));
	this.Index[0] = 0;
	this.Index[6] = 0;
	this.Index[12] = 0;
	this.Index[18] = 5;
	this.Index[24] = 5;
	this.Index[30] = 9;
	this.Index[1] = 3;
	this.Index[7] = 4;
	this.Index[13] = 1;
	this.Index[19] = 6;
	this.Index[25] = 1;
	this.Index[31] = 2;
	this.Index[2] = 2;
	this.Index[8] = 7;
	this.Index[14] = 11;
	this.Index[20] = 7;
	this.Index[26] = 2;
	this.Index[32] = 3;
	this.Index[3] = 2;
	this.Index[9] = 7;
	this.Index[15] = 11;
	this.Index[21] = 7;
	this.Index[27] = 2;
	this.Index[33] = 3;
	this.Index[4] = 1;
	this.Index[10] = 3;
	this.Index[16] = 10;
	this.Index[22] = 4;
	this.Index[28] = 6;
	this.Index[34] = 8;
	this.Index[5] = 0;
	this.Index[11] = 0;
	this.Index[17] = 0;
	this.Index[23] = 5;
	this.Index[29] = 5;
	this.Index[35] = 9;
	this.CreateNormals()
}
Cube.prototype = new PolygonMesh();
Cube.prototype.constructor = Cube;
function Cylinder(g, e, j) {
	PolygonMesh.call(this);
	j *= 0.5;
	if ((g % 2) != 0) {
		++g
	}
	this.Create(g, (g - 2) * 3);
	for ( var c = 0; c < g; c += 2) {
		var b = (c / (g - 2)) * (2 * Math.PI);
		var h = new Point(Math.cos(b) * e, Math.sin(b) * e, j);
		var f = new Point(h.x, h.y, -j);
		this.SetPoint(c, h);
		this.SetPoint(c + 1, f);
		var a = new Point(c / (g - 2), 1);
		this.SetUV(c, a);
		this.SetUV(c + 1, new Point(a.x, 0));
		if (c < (g - 2)) {
			this.Index[c * 3 + 0] = c;
			this.Index[c * 3 + 1] = c + 1;
			this.Index[c * 3 + 2] = c + 3;
			this.Index[c * 3 + 3] = c + 3;
			this.Index[c * 3 + 4] = c + 2;
			this.Index[c * 3 + 5] = c
		}
	}
	this.CreateNormals();
	if (g > 2) {
		var d = (g * 3) - 6;
		this.Normal[0] = (this.Normal[0] + this.Normal[d + 0]) * 0.5;
		this.Normal[1] = (this.Normal[1] + this.Normal[d + 1]) * 0.5;
		this.Normal[2] = (this.Normal[2] + this.Normal[d + 2]) * 0.5;
		this.Normal[3] = (this.Normal[3] + this.Normal[d + 3]) * 0.5;
		this.Normal[4] = (this.Normal[4] + this.Normal[d + 4]) * 0.5;
		this.Normal[5] = (this.Normal[5] + this.Normal[d + 5]) * 0.5;
		this.Normal[d + 0] = this.Normal[0];
		this.Normal[d + 1] = this.Normal[1];
		this.Normal[d + 2] = this.Normal[2];
		this.Normal[d + 3] = this.Normal[3];
		this.Normal[d + 4] = this.Normal[4];
		this.Normal[d + 5] = this.Normal[5]
	}
}
Cylinder.prototype = new PolygonMesh();
Cylinder.prototype.constructor = Cylinder;
function Rectangle(a, b) {
	PolygonMesh.call(this);
	this.Create(4, 6);
	this.SetPoint(0, new Point(-a, -b));
	this.SetPoint(1, new Point(a, -b));
	this.SetPoint(2, new Point(a, b));
	this.SetPoint(3, new Point(-a, b));
	this.SetUV(0, new Point(0, 0));
	this.SetUV(1, new Point(1, 0));
	this.SetUV(2, new Point(1, 1));
	this.SetUV(3, new Point(0, 1));
	this.Index[0] = 0;
	this.Index[1] = 1;
	this.Index[2] = 2;
	this.Index[3] = 2;
	this.Index[4] = 3;
	this.Index[5] = 0;
	this.CreateNormals()
}
Rectangle.prototype = new PolygonMesh();
Rectangle.prototype.constructor = Rectangle;
function Sphere(l, e, a, j) {
	PolygonMesh.call(this);
	j = 1 - j;
	var o = (e * j);
	this.Create(l * o, ((l - 1) * 6) * (o - 1));
	var d = 0;
	var q = 0;
	for ( var f = 0; f < o; ++f) {
		var h = f / (e - 1);
		var t = h * Math.PI;
		var m = Math.cos(t) * a;
		var k = Math.sin(t) * a;
		for ( var g = 0; g < l; ++g) {
			var i = g / (l - 1);
			var s = i * (2 * Math.PI);
			this.SetPoint(q, new Point(Math.cos(s) * k, Math.sin(s) * k, m));
			this.SetUV(q, new Point(i, h));
			if ((f > 0) && (g < (l - 1))) {
				var n = q - l;
				this.Index[d * 3 + 0] = n;
				this.Index[d * 3 + 1] = q;
				this.Index[d * 3 + 2] = q + 1;
				++d;
				this.Index[d * 3 + 0] = q + 1;
				this.Index[d * 3 + 1] = n + 1;
				this.Index[d * 3 + 2] = n;
				++d
			}
			++q
		}
	}
	this.CreateNormals();
	for ( var g = 0; g < l; ++g) {
		var c = g * 3;
		this.Normal[c + 0] = 0;
		this.Normal[c + 1] = 0;
		this.Normal[c + 2] = -1;
		if (o == e) {
			c = (Point.Length - 3) - c;
			this.Normal[c + 0] = 0;
			this.Normal[c + 1] = 0;
			this.Normal[c + 2] = 1
		}
	}
	for ( var f = 1; f < (o - 1); ++f) {
		var c = (f * l) * 3;
		var b = c + ((l - 1) * 3);
		this.Normal[c + 0] = (this.Normal[c + 0] + this.Normal[b + 0]) * 0.5;
		this.Normal[c + 1] = (this.Normal[c + 1] + this.Normal[b + 1]) * 0.5;
		this.Normal[c + 2] = (this.Normal[c + 2] + this.Normal[b + 2]) * 0.5;
		this.Normal[b + 0] = this.Normal[c + 0];
		this.Normal[b + 1] = this.Normal[c + 1];
		this.Normal[b + 2] = this.Normal[c + 2]
	}
}
Sphere.prototype = new PolygonMesh();
Sphere.prototype.constructor = Sphere;
function Torus(m, o, f, a) {
	PolygonMesh.call(this);
	this.Create(m * o, ((m - 1) * 6) * (o - 1));
	var r;
	var q;
	var p = 0;
	var e = 0;
	for ( var c = 0; c < o; ++c) {
		q = (c / (o - 1)) * (2 * Math.PI);
		for ( var b = 0; b < m; ++b) {
			r = (b / (m - 1)) * (2 * Math.PI);
			var n = a + (f * Math.cos(q));
			var l = n * Math.cos(r);
			var k = n * Math.sin(r);
			var h = f * Math.sin(q);
			this.SetPoint(p, new Point(l, k, h));
			this.SetUV(p, new Point(c / (o - 1), b / (m - 1)));
			if ((c < (o - 1)) && (b < (m - 1))) {
				this.Index[e] = p;
				this.Index[e + 1] = p + 1;
				this.Index[e + 2] = p + 1 + m;
				this.Index[e + 3] = p + 1 + m;
				this.Index[e + 4] = p + m;
				this.Index[e + 5] = p;
				e += 6
			}
			++p
		}
	}
	this.CreateNormals();
	var g;
	for ( var c = 0; c < o; ++c) {
		e = c * m * 3;
		g = e + (m - 1) * 3;
		this.Normal[e] = (this.Normal[e] + this.Normal[g]) * 0.5;
		this.Normal[e + 1] = (this.Normal[e + 1] + this.Normal[g + 1]) * 0.5;
		this.Normal[e + 2] = (this.Normal[e + 2] + this.Normal[g + 2]) * 0.5;
		this.Normal[g] = this.Normal[e];
		this.Normal[g + 1] = this.Normal[e + 1];
		this.Normal[g + 2] = this.Normal[e + 2]
	}
	var d = (o - 1) * m * 3;
	for ( var c = 0; c < m; ++c) {
		e = c * 3;
		this.Normal[e] = (this.Normal[e] + this.Normal[e + d]) * 0.5;
		this.Normal[e + 1] = (this.Normal[e + 1] + this.Normal[e + d + 1]) * 0.5;
		this.Normal[e + 2] = (this.Normal[e + 2] + this.Normal[e + d + 2]) * 0.5;
		this.Normal[e + d] = this.Normal[e];
		this.Normal[e + d + 1] = this.Normal[e + 1];
		this.Normal[e + d + 2] = this.Normal[e + 2]
	}
}
Torus.prototype = new PolygonMesh();
Torus.prototype.constructor = Torus;
function OBJ() {
}
OBJ.Load = function(b) {
	var q = new PolygonMesh();
	var p = new MemoryStream(b);
	var d = new StreamReader(p);
	var m = 0;
	var g = 0;
	while (!d.IsEndOfStream()) {
		var r = new String(d.ReadLine());
		if (r.StartsWith("v ")) {
			++m
		} else {
			if (r.StartsWith("f ")) {
				++g;
				if (r.Split(" ").length >= 5) {
					++g
				}
			}
		}
	}
	if (m > 0) {
		var j = m * 3;
		var o = m * 2;
		var k = g * 3;
		q.Create(m, k);
		var c = 0;
		var n = 0;
		var e = 0;
		p.SetPosition(0);
		d = new StreamReader(p);
		while (!d.IsEndOfStream()) {
			var r = new String(d.ReadLine());
			if (r.StartsWith("vt ")) {
				if ((n + 1) < q.UV.length) {
					var h = r.Split(" ").Trim();
					q.UV[n] = parseFlaot(h[1]);
					q.UV[n + 1] = parseFlaot(h[2]);
					n += 2
				}
			} else {
				if (r.StartsWith("vn ")) {
				} else {
					if (r.StartsWith("v ")) {
						if ((c + 2) < q.VertexPoint.length) {
							var h = r.Split(" ");
							q.VertexPoint[c] = parseFloat(h[1]);
							q.VertexPoint[c + 1] = parseFloat(h[2]);
							q.VertexPoint[c + 2] = parseFloat(h[3]);
							c += 3
						}
					} else {
						if (r.StartsWith("f ")) {
							var h = r.Split(" ");
							for ( var a = 1; a < h.length; ++a) {
								var f = h[a].split("/");
								if (e < q.Index.length) {
									q.Index[e] = parseInt(f[0]) - 1;
									++e
								}
							}
							if (h.length >= 5) {
								q.Index[e] = q.Index[e - 1];
								q.Index[e - 1] = q.Index[e - 2];
								q.Index[e + 1] = q.Index[e - 4];
								e += 2
							}
						} else {
							if (r.StartsWith("g ")) {
								var l = new PolygonGroup();
								l.Name = r.Substring(2);
								l.StartIndex = e;
								q.Group.Add(l)
							}
						}
					}
				}
			}
		}
		for ( var a = 0; a < q.Group.length; ++a) {
			if ((a + 1) < q.Group.length) {
				q.Group[a].Count = q.Group[a + 1].StartIndex
						- q.Group[a].StartIndex
			} else {
				q.Group[a].Count = q.NumIndices - q.Group[a].StartIndex
			}
		}
	}
	return q
};
OBJ.Write = function(e, f) {
	var d = new StreamWriter(e);
	d.Write("# Nutty Engine OBJ Export\n");
	d.Write("# " + f.GetNumPoints() + " Verts\n");
	d.Write("# " + (f.GetNumIndices() / 3) + " Indices\n");
	d.Write("\n");
	if (f.VertexPoint != null) {
		var b = f.VertexPoint.length;
		for ( var a = 0; a < b; a += 3) {
			d.Write("v " + f.VertexPoint[a].toFixed(6) + " "
					+ f.VertexPoint[a + 1].toFixed(6) + " "
					+ f.VertexPoint[a + 2].toFixed(6) + "\n")
		}
		d.Write("\n")
	}
	if (f.UV != null) {
		var b = f.UV.length;
		for ( var a = 0; a < b; a += 2) {
			if (f.UV[a] && f.UV[a + 1]) {
				d.Write("vt " + f.UV[a].toFixed(6) + " "
						+ f.UV[a + 1].toFixed(6) + "\n")
			}
		}
		d.Write("\n")
	}
	if (f.Index != null) {
		var b = f.Index.length;
		var c = 0;
		for ( var a = 0; a < b; a += 3) {
			if (f.Group && (c < f.Group.length) && (f.Group[c].StartIndex <= a)) {
				d.Write("g " + f.Group[c].Name + "\n");
				++c
			}
			d.Write("f " + (f.Index[a] + 1) + "/" + (f.Index[a] + 1) + " "
					+ (f.Index[a + 1] + 1) + "/" + (f.Index[a + 1] + 1) + " "
					+ (f.Index[a + 2] + 1) + "/" + (f.Index[a + 2] + 1) + "\n")
		}
	}
};
function UUID() {
}
UUID.Generate = function() {
	return "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx".replace(/x/g, function() {
		return (Math.random() * 15 | 0).toString(16)
	})
};
function XmlItem(a, b) {
	this.Name = (a == null) ? "" : a;
	this.Value = (b == null) ? "" : b
}
XmlItem.prototype.ValueBool = function(a) {
	if (a == null) {
		return ((this.Value.toLowerCase() == "true") || (this.ValueInt() > 0))
	} else {
		if (a) {
			this.Value = "true"
		} else {
			this.Value = "false"
		}
	}
};
XmlItem.prototype.ValueInt = function(a) {
	if (a == null) {
		return parseInt(this.Value)
	} else {
		this.Value = a.toString()
	}
};
XmlItem.prototype.ValueDouble = function(a) {
	if (a == null) {
		return parseFloat(this.Value)
	} else {
		this.Value = a.toString()
	}
};
function XmlNode() {
	XmlItem.call(this);
	this.mAttribute = new Array();
	this.mChild = new Array();
	this.mParent
}
XmlNode.prototype = new XmlItem();
XmlNode.prototype.constructor = XmlNode;
XmlNode.prototype.toString = function(g, e, c) {
	if (e == null) {
		e = true
	}
	if (c == null) {
		c = 0
	}
	var d;
	var a;
	var h;
	var j = "";
	var f;
	var b = "";
	if (e) {
		b = "\n"
	}
	if (e) {
		for (d = 0; d < c; ++d) {
			j += "\t"
		}
	}
	j += "<";
	j += g.Name;
	for (d = 0; d < g.GetNumAttributes(); ++d) {
		h = g.GetAttributeAt(d);
		f = h.Value;
		f = f.replace(new RegExp('"', "g"), "&#34;");
		f = f.replace(new RegExp("&", "g"), "&#38;");
		f = f.replace(new RegExp("<", "g"), "&#60;");
		f = f.replace(new RegExp(">", "g"), "&#62;");
		f = f.replace(new RegExp("\n", "g"), "&#13;");
		j += " ";
		j += h.Name;
		j += '="';
		j += f;
		j += '"'
	}
	if ((g.Value.length > 0) && (g.GetNumChildren() == 0)) {
		f = g.Value;
		f = f.replace(new RegExp('"', "g"), "&#34;");
		f = f.replace(new RegExp("&", "g"), "&#38;");
		f = f.replace(new RegExp("<", "g"), "&#60;");
		f = f.replace(new RegExp(">", "g"), "&#62;");
		f = f.replace(new RegExp("\n", "g"), "&#13;");
		j += ">" + f + "</" + g.Name + ">" + b
	} else {
		if (g.GetNumChildren() == 0) {
			j += " />" + b
		} else {
			j += ">" + b
		}
	}
	for (d = 0; d < g.GetNumChildren(); ++d) {
		a = g.GetChildAt(d);
		j += this.toString(a, e, c + 1)
	}
	if (g.GetNumChildren() > 0) {
		if (e) {
			for (d = 0; d < c; ++d) {
				j += "\t"
			}
		}
		j += "</";
		j += g.Name;
		j += ">";
		if (e && (c != 0)) {
			j += "\n"
		}
	}
	return j
};
XmlNode.prototype.Clear = function() {
	this.Name = "";
	this.Value = "";
	this.mAttribute = new Array();
	this.mChild = new Array()
};
XmlNode.prototype.AddAttribute = function(a) {
	this.mAttribute.push(a)
};
XmlNode.prototype.RemoveAttribute = function(c, b) {
	if (b == null) {
		b = 1
	}
	var a = 0;
	for ( var d = 0; d < this.mAttribute.length; ++d) {
		if (this.mAttribute[d].Name == c) {
			++a;
			if (a >= b) {
				this.RemoveAttributeAt(d);
				return
			}
		}
	}
};
XmlNode.prototype.RemoveAttributeAt = function(a) {
	this.mAttribute.splice(a, 1)
};
XmlNode.prototype.RemoveAttributes = function() {
	this.mAttribute = new Array()
};
XmlNode.prototype.GetAttribute = function(c, b) {
	if (b == null) {
		b = 1
	}
	var a = 0;
	for ( var d = 0; d < this.mAttribute.length; ++d) {
		if (this.mAttribute[d].Name == c) {
			++a;
			if (a >= b) {
				return this.mAttribute[d]
			}
		}
	}
	return null
};
XmlNode.prototype.GetAttributeAt = function(a) {
	if (a < this.mAttribute.length) {
		return this.mAttribute[a]
	}
	return null
};
XmlNode.prototype.GetAttributeValue = function(b, a) {
	if (a == null) {
		a = 1
	}
	var c = this.GetAttribute(b, a);
	if (c != null) {
		return c.Value
	}
	return ""
};
XmlNode.prototype.GetAttributeValueBool = function(b, a) {
	if (a == null) {
		a = 1
	}
	var c = this.GetAttribute(b, a);
	if (c != null) {
		return c.ValueBool()
	}
	return false
};
XmlNode.prototype.GetAttributeValueInt = function(b, a) {
	if (a == null) {
		a = 1
	}
	var c = this.GetAttribute(b, a);
	if (c != null) {
		return c.ValueInt()
	}
	return 0
};
XmlNode.prototype.GetAttributeValueDouble = function(b, a) {
	if (a == null) {
		a = 1
	}
	var c = this.GetAttribute(b, a);
	if (c != null) {
		return c.ValueDouble()
	}
	return 0
};
XmlNode.prototype.SetAttributeValue = function(a, c) {
	var b = this.GetAttribute(a);
	if (b != null) {
		b.Value = c
	} else {
		this.AddAttribute(new XmlItem(a, c))
	}
};
XmlNode.prototype.SetAttributeValueBool = function(a, c) {
	var b = this.GetAttribute(a);
	if (b != null) {
		b.ValueBool(c)
	} else {
		var b = new XmlItem();
		b.Name = a;
		b.ValueBool(c);
		this.AddAttribute(b)
	}
};
XmlNode.prototype.SetAttributeValueInt = function(a, c) {
	var b = this.GetAttribute(a);
	if (b != null) {
		b.ValueInt(c)
	} else {
		var b = new XmlItem();
		b.Name = a;
		b.ValueInt(c);
		this.AddAttribute(b)
	}
};
XmlNode.prototype.SetAttributeValueDouble = function(a, c) {
	var b = this.GetAttribute(a);
	if (b != null) {
		b.ValueDouble(c)
	} else {
		var b = new XmlItem();
		b.Name = a;
		b.ValueDouble(c);
		this.AddAttribute(b)
	}
};
XmlNode.prototype.GetNumAttributes = function() {
	return this.mAttribute.length
};
XmlNode.prototype.AddChild = function(a) {
	a.SetParent(this);
	this.mChild.push(a)
};
XmlNode.prototype.InsertChild = function(a, b) {
	b.SetParent(this);
	this.mChild.splice(a, 0, b)
};
XmlNode.prototype.RemoveChild = function(c, b) {
	if (b == null) {
		b = 1
	}
	var a = 0;
	for ( var d = 0; d < this.mChild.length; ++d) {
		if (this.mChild[d].Name == c) {
			++a;
			if (a >= b) {
				this.RemoveChildAt(d);
				return
			}
		}
	}
};
XmlNode.prototype.RemoveChildAt = function(a) {
	this.mChild.splice(a, 1)
};
XmlNode.prototype.RemoveChildren = function() {
	this.mChild = new Array()
};
XmlNode.prototype.GetChild = function(c, b) {
	if (b == null) {
		b = 1
	}
	var a = 0;
	for ( var d = 0; d < this.mChild.length; ++d) {
		if (this.mChild[d].Name == c) {
			++a;
			if (a >= b) {
				return this.mChild[d]
			}
		}
	}
	return null
};
XmlNode.prototype.GetChildAt = function(a) {
	if (a == null) {
		a = 1
	}
	if (a < this.mChild.length) {
		return this.mChild[a]
	}
	return null
};
XmlNode.prototype.GetChildValue = function(b, a) {
	var c = this.GetChild(b, a);
	if (c != null) {
		return c.Value
	}
	return ""
};
XmlNode.prototype.GetChildValueBool = function(b, a) {
	if (a == null) {
		a = 1
	}
	var c = this.GetChild(b, a);
	if (c != null) {
		return c.ValueBool()
	}
	return false
};
XmlNode.prototype.GetChildValueInt = function(b, a) {
	if (a == null) {
		a = 1
	}
	var c = this.GetChild(b, a);
	if (c != null) {
		return c.ValueInt()
	}
	return 0
};
XmlNode.prototype.GetChildValueDouble = function(b, a) {
	if (a == null) {
		a = 1
	}
	var c = this.GetChild(b, a);
	if (c != null) {
		return c.ValueDouble()
	}
	return 0
};
XmlNode.prototype.SetChildValue = function(b, c, a) {
	if (a == null) {
		a = 1
	}
	var d = this.GetChild(b, a);
	if (d != null) {
		d.Value = c
	} else {
		var d = new XmlNode();
		d.Name = b;
		d.Value = c;
		this.AddChild(d)
	}
};
XmlNode.prototype.SetChildValueBool = function(b, c, a) {
	if (a == null) {
		a = 1
	}
	var d = this.GetChild(b, a);
	if (d != null) {
		d.ValueBool(c)
	} else {
		var d = new XmlNode();
		d.Name = b;
		d.ValueBool(c);
		this.AddChild(d)
	}
};
XmlNode.prototype.SetChildValueInt = function(b, c, a) {
	if (a == null) {
		a = 1
	}
	var d = this.GetChild(b, a);
	if (d != null) {
		d.ValueInt(c)
	} else {
		var d = new XmlNode();
		d.Name = b;
		d.ValueInt(c);
		this.AddChild(d)
	}
};
XmlNode.prototype.SetChildValueDouble = function(b, c, a) {
	if (a == null) {
		a = 1
	}
	var d = this.GetChild(b, a);
	if (d != null) {
		d.ValueDouble(c)
	} else {
		var d = new XmlNode();
		d.Name = b;
		d.ValueDouble(c);
		this.AddChild(d)
	}
};
XmlNode.prototype.AddChildren = function(a) {
	this.InsertChildren(a)
};
XmlNode.prototype.InsertChildren = function(c, a) {
	if (a == null) {
		a = this.mChild.length
	}
	for ( var b = 0; b < c.GetNumChildren(); ++b) {
		this.InsertChild(a + b, c.GetChildAt(b))
	}
};
XmlNode.prototype.GetChildren = function(a) {
	var c = new XmlNode();
	c.Name = Name;
	for ( var b = 0; b < this.mChild.length; ++b) {
		if (this.mChild[b].Name == a) {
			c.AddChild(this.mChild[b])
		}
	}
	return c
};
XmlNode.prototype.GetNumChildren = function() {
	return this.mChild.length
};
XmlNode.prototype.SetParent = function(a) {
	this.mParent = a
};
XmlNode.prototype.GetParent = function() {
	return this.mParent
};
XmlNode.prototype.ToString = function(a) {
	if (a == null) {
		a = true
	}
	return this.toString(this, a)
};
function Xml() {
	var a;
	var b
}
function XmlStartElement(a, c, f) {
	var b = a;
	if ((b.mCurrentNode === b.mRoot) && (b.mRoot.Name.length == 0)) {
		b.mRoot.Name = c;
		if (f != null) {
			for ( var e = 0; e < f.length; e += 2) {
				b.mCurrentNode.AddAttribute(new XmlItem(f[e], f[e + 1]))
			}
		}
	} else {
		if (b.mCurrentNode != null) {
			var d = new XmlNode();
			d.Name = c;
			d.SetParent(b.mCurrentNode);
			b.mCurrentNode.AddChild(d);
			b.mCurrentNode = b.mCurrentNode.GetChildAt(b.mCurrentNode
					.GetNumChildren() - 1);
			if (f != null) {
				for ( var e = 0; e < f.length; e += 2) {
					b.mCurrentNode.AddAttribute(new XmlItem(f[e], f[e + 1]))
				}
			}
		}
	}
}
function XmlEndElement(a, c) {
	var b = a;
	b.mCurrentNode = b.mCurrentNode.GetParent()
}
function XmlTextElement(b, d, a) {
	if (a > 0) {
		var c = b;
		if (c.mCurrentNode != null) {
			c.mCurrentNode.Value = d
		}
	}
}
Xml.prototype.Load = function(b) {
	var a = true;
	this.mRoot = new XmlNode();
	this.mCurrentNode = this.mRoot;
	var c = new XmlParser();
	c.SetXmlStartElement(XmlStartElement);
	c.SetXmlEndElement(XmlEndElement);
	c.SetXmlTextElement(XmlTextElement);
	a = c.Parse(this, b, b.length);
	if (a) {
		return this.mRoot
	}
	return null
};
var XmlWhiteSpace = [ " ", "\t", "\r", "\n" ];
var XmlSpecialCharacter = [ "<", ">", "&", '"', "'" ];
var XmlEscape = [ "&lt;", "&gt;", "&amp;", "&quot;", "&apos;" ];
function XmlParser() {
	var f;
	var b;
	var d;
	var a;
	var e;
	var c
}
XmlParser.prototype.IndexOf = function(c, a, h, f, g) {
	if (a >= f) {
		var e;
		var b;
		var d = a - (f - 1);
		for (e = g; e < d; ++e) {
			for (b = 0; b < f; ++b) {
				if (c[e + b] == h[b]) {
					if (b == (f - 1)) {
						return e
					}
				} else {
					break
				}
			}
		}
	}
	return -1
};
XmlParser.prototype.Truncate = function(c, a, f, e) {
	var b;
	if (e > f) {
		for ( var d = f; (d < e) && (d < a); ++d) {
			for (b = 0; b < XmlWhiteSpace.length; ++b) {
				if (c[d] == XmlWhiteSpace[b]) {
					break
				}
			}
			if (b == XmlWhiteSpace.length) {
				return d
			}
		}
	} else {
		for ( var d = f - 1; (d > e) && (d < a); --d) {
			for (b = 0; b < XmlWhiteSpace.length; ++b) {
				if (c[d] == XmlWhiteSpace[b]) {
					break
				}
			}
			if (b == XmlWhiteSpace.length) {
				return d + 1
			}
		}
	}
	return f
};
XmlParser.prototype.ParseName = function(c, h, g) {
	var f = false;
	for ( var e = h; e < g; ++e) {
		for ( var b = 0; b < XmlWhiteSpace.length; ++b) {
			if (c[e] == XmlWhiteSpace[b]) {
				g = e;
				f = true;
				break
			}
		}
		if (f) {
			break
		}
	}
	var d = g - h;
	var a = c.substring(h, h + d);
	return a
};
XmlParser.prototype.ParseAttributes = function(e, h, d) {
	var a;
	var j;
	var f = 0;
	var g = 0;
	for ( var c = h; c < d; ++c) {
		if (e[c] == "=") {
			++g
		}
	}
	if (g > 0) {
		j = (g * 2) + 1;
		var b = new Array();
		h = this.FindWhiteSpace(e, h, d);
		while ((h < d) && (g > 0)) {
			h = this.SkipWhiteSpace(e, h, d);
			if (h < d) {
				a = this.IndexOf(e, d, "=", 1, h);
				if (a == -1) {
					break
				}
				a = this.Truncate(e, d, a, h);
				j = a - h;
				b.push(e.substring(h, h + j));
				++f;
				h = this.IndexOf(e, d, '"', 1, a) + 1;
				if (h == -1) {
					break
				}
				a = this.IndexOf(e, d, '"', 1, h);
				if (a == -1) {
					break
				}
				j = a - h;
				b.push(e.substring(h, h + j));
				++f;
				h = a + 1;
				--g
			}
		}
		return b
	}
	return 0
};
XmlParser.prototype.FindWhiteSpace = function(b, e, d) {
	for ( var c = e; c < d; ++c) {
		for ( var a = 0; a < XmlWhiteSpace.length; ++a) {
			if (b[c] == XmlWhiteSpace[a]) {
				return c
			}
		}
	}
	return e
};
XmlParser.prototype.SkipWhiteSpace = function(b, e, d) {
	var a;
	for ( var c = e; c < d; ++c) {
		for (a = 0; a < XmlWhiteSpace.length; ++a) {
			if (b[c] == XmlWhiteSpace[a]) {
				break
			}
		}
		if (a == XmlWhiteSpace.length) {
			return c
		}
	}
	return e
};
XmlParser.prototype.Parse = function(c, k, e) {
	var n;
	var h;
	var a;
	var p;
	var l;
	var o;
	var b;
	var d;
	for ( var g = 0; g < e; ++g) {
		if (k[g] == "<") {
			n = g + 1;
			h = this.IndexOf(k, e, ">", 1, g + 1);
			if (h != -1) {
				if (k[n] == "?") {
					if (this.mXmlDeclaration != null) {
						n = this.Truncate(k, e, n + 1, h);
						a = this.Truncate(k, e, h, n);
						b = this.ParseName(k, n, a);
						d = this.ParseAttributes(k, n, a);
						this.mXmlDeclaration(c, b, d)
					}
				} else {
					if (k[n] == "!") {
						if (k[n + 1] == "-") {
							h = this.IndexOf(k, e, "-->", 3, n + 2) + 3;
							if (this.mXmlComment) {
								n = this.Truncate(k, e, n + 3, h);
								a = this.Truncate(k, e, h - 3, n);
								p = a - n;
								o = k.substring(n, n + p);
								this.mXmlComment(c, o)
							}
						} else {
							if (k[n + 1] == "[") {
								h = IndexOf(k, e, "]]>", 3, n + 8) + 3;
								if (this.mXmlTextElement) {
									n = this.Truncate(k, e, n + 8, h);
									a = this.Truncate(k, e, h - 3, n);
									p = a - n;
									o = k.substring(n, n + p);
									this.mXmlTextElement(c, o, p)
								}
							}
						}
					} else {
						if (k[n] == "/") {
							if (this.mXmlEndElement != null) {
								n = this.Truncate(k, e, n + 1, h);
								a = this.Truncate(k, e, h, n);
								b = this.ParseName(k, n, a);
								this.mXmlEndElement(c, b)
							}
						} else {
							if (this.mXmlStartElement != null) {
								n = this.Truncate(k, e, n, h);
								a = this.Truncate(k, e, h, n);
								var m = false;
								if (k[a - 1] == "/") {
									m = true;
									--a
								}
								b = this.ParseName(k, n, a);
								d = this.ParseAttributes(k, n, a);
								this.mXmlStartElement(c, b, d);
								if (m && (this.mXmlEndElement != null)) {
									this.mXmlEndElement(c, b)
								}
							}
						}
					}
				}
				g = h
			} else {
				return false
			}
		} else {
			if (this.mXmlTextElement != null) {
				var f;
				for (f = 0; f < XmlWhiteSpace.length; ++f) {
					if (k[g] == XmlWhiteSpace[f]) {
						break
					}
				}
				if (f == XmlWhiteSpace.length) {
					n = g;
					h = this.IndexOf(k, e, "<", 1, n);
					if (h != -1) {
						a = this.Truncate(k, e, h, n);
						p = a - n;
						o = k.substring(n, n + p);
						this.mXmlTextElement(c, o, p);
						g = h - 1
					} else {
						return false
					}
				}
			}
		}
	}
	return true
};
XmlParser.prototype.SetXmlDeclaration = function(a) {
	this.mXmlDeclaration = a
};
XmlParser.prototype.SetXmlStartElement = function(a) {
	this.mXmlStartElement = a
};
XmlParser.prototype.SetXmlEndElement = function(a) {
	this.mXmlEndElement = a
};
XmlParser.prototype.SetXmlTextElement = function(a) {
	this.mXmlTextElement = a
};
XmlParser.prototype.SetXmlComment = function(a) {
	this.mXmlComment = a
};
XmlParser.prototype.SetXmlError = function(a) {
	this.mXmlError = a
};
function Shader() {
}
Shader.prototype.GetShaderSource = function(d) {
	var b = document.getElementById(d);
	var c = "";
	var a = b.firstChild;
	while (a) {
		if (a.nodeType == 3) {
			c += a.textContent
		}
		a = a.nextSibling
	}
	return c
};
Shader.prototype.LoadShader = function(d, a) {
	var c = this.GetShaderSource(d);
	var b = new GLShader();
	b.CreateShader(a ? b.ShaderType.Vertex : b.ShaderType.Fragment, c);
	c = b.GetLog();
	if (c && (c.length > 0)) {
		alert(c)
	}
	return b
};
Shader.prototype.CreateProgram = function() {
	var b = new GLShaderProgram();
	b.Create();
	for ( var a = 0; a < arguments.length; ++a) {
		b.AddShader(arguments[a])
	}
	b.VertexPointer = b.GetAttribute("Vertex");
	gl.enableVertexAttribArray(b.VertexPointer);
	b.UvPointer = b.GetAttribute("Uv");
	if (b.UvPointer != null) {
		gl.enableVertexAttribArray(b.UvPointer)
	}
	b.NormalPointer = b.GetAttribute("Normal");
	if (b.NormalPointer != null) {
		gl.enableVertexAttribArray(b.NormalPointer)
	}
	b.ColourPointer = b.GetAttribute("Colour");
	if (b.ColourPointer != null) {
		gl.enableVertexAttribArray(b.ColourPointer)
	}
	source = b.GetLog();
	if (source && source.length > 0) {
		alert(source)
	}
	return b
};
function Texture() {
	this.Texture = null
}
Texture.prototype.Load = function(b, a) {
	var c = new Image();
	c.onload = function() {
		var d = new GLTexture();
		d.Create(c.width, c.height, a, a * 8, c, d.Filter.WrapRepeat,
				d.Filter.FilterLinear);
		this.parent.Texture = d
	};
	c.parent = this;
	c.src = b
};
function GLShader() {
	this.ShaderType = {
		Vertex : 0,
		Fragment : 1
	};
	this.Name = null;
	this.Shader = null
}
GLShader.prototype.CreateShader = function(a, b) {
	this.RemoveShader();
	if (a == this.ShaderType.Vertex) {
		this.Shader = gl.createShader(gl.VERTEX_SHADER)
	} else {
		this.Shader = gl.createShader(gl.FRAGMENT_SHADER)
	}
	if (this.Shader != null) {
		gl.shaderSource(this.Shader, b);
		gl.compileShader(this.Shader)
	}
};
GLShader.prototype.RemoveShader = function() {
	gl.deleteShader(this.Shader);
	this.Shader = null
};
GLShader.prototype.GetLog = function() {
	return gl.getShaderInfoLog(this.Shader)
};
function GLShaderProgram() {
	this.Name = null;
	this.Program = null
}
GLShaderProgram.prototype.Create = function() {
	this.Remove();
	this.Program = gl.createProgram()
};
GLShaderProgram.prototype.Load = function() {
	gl.useProgram(this.Program)
};
GLShaderProgram.prototype.Remove = function() {
	gl.deleteProgram(this.Program);
	this.Program = null
};
GLShaderProgram.prototype.AddShader = function(a) {
	gl.attachShader(this.Program, a.Shader);
	gl.linkProgram(this.Program)
};
GLShaderProgram.prototype.RemoveShader = function(a) {
	gl.detachShader(this.Program, a.Shader)
};
GLShaderProgram.prototype.GetAttribute = function(a) {
	return gl.getAttribLocation(this.Program, a)
};
GLShaderProgram.prototype.GetVariable = function(a) {
	return gl.getUniformLocation(this.Program, a)
};
GLShaderProgram.prototype.SetVariableIntByName = function(c, a, e, d, b) {
	this.SetVariableInt(gl.getUniformLocation(this.Program, c), a, e, d, b)
};
GLShaderProgram.prototype.SetVariableInt = function(c, a, e, d, b) {
	if (e == null) {
		gl.uniform1i(c, a)
	} else {
		if (d == null) {
			gl.uniform2i(c, a, e)
		} else {
			if (b == null) {
				gl.uniform3i(c, a, e, d)
			} else {
				gl.uniform4i(c, a, e, d, b)
			}
		}
	}
};
GLShaderProgram.prototype.SetVariableByName = function(c, a, e, d, b) {
	this.SetVariable(gl.getUniformLocation(this.Program, c), a, e, d, b)
};
GLShaderProgram.prototype.SetVariable = function(c, a, e, d, b) {
	if (e == null) {
		gl.uniform1f(c, a)
	} else {
		if (d == null) {
			gl.uniform2f(c, a, e)
		} else {
			if (b == null) {
				gl.uniform3f(c, a, e, d)
			} else {
				gl.uniform4f(c, a, e, d, b)
			}
		}
	}
};
GLShaderProgram.prototype.SetMatrixByName = function(b, a, c) {
	this.SetMatrix(gl.getUniformLocation(this.Program, b), a, c)
};
GLShaderProgram.prototype.SetMatrix = function(b, a, c) {
	if (c == 2) {
		gl.uniformMatrix2fv(b, false, a)
	} else {
		if (c == 3) {
			gl.uniformMatrix3fv(b, false, a)
		} else {
			if (c > 3) {
				gl.uniformMatrix4fv(b, false, a)
			}
		}
	}
};
GLShaderProgram.prototype.GetLog = function() {
	return gl.getProgramInfoLog(this.Program)
};
function GLVertexBufferObject() {
	this.VertexBuffer = null;
	this.UvBuffer = null;
	this.NormalBuffer = null;
	this.ColourBuffer = null;
	this.IndexBuffer = null;
	this.BufferType = {
		Static : 0,
		Dynamic : 1
	};
	this.Type;
	this.Mesh = null
}
GLVertexBufferObject.prototype.Create = function(b, a) {
	this.Remove();
	this.Mesh = b;
	if (a == this.BufferType.Static) {
		a = gl.STATIC_DRAW
	} else {
		a = gl.DYNAMIC_DRAW
	}
	this.Type = a;
	this.VertexBuffer = gl.createBuffer();
	if (this.VertexBuffer == null) {
		this.Remove();
		return false
	}
	gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(b.VertexPoint), a);
	if (b.UV != null) {
		this.UvBuffer = gl.createBuffer();
		if (this.UvBuffer == null) {
			this.Remove();
			return false
		}
		gl.bindBuffer(gl.ARRAY_BUFFER, this.UvBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(b.UV), a)
	}
	if (b.Normal != null) {
		this.NormalBuffer = gl.createBuffer();
		if (this.NormalBuffer == null) {
			this.Remove();
			return false
		}
		gl.bindBuffer(gl.ARRAY_BUFFER, this.NormalBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(b.Normal), a)
	}
	if (b.Colour != null) {
		this.ColourBuffer = gl.createBuffer();
		if (this.ColourBuffer == null) {
			this.Remove();
			return false
		}
		gl.bindBuffer(gl.ARRAY_BUFFER, this.ColourBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(b.Colour), a)
	}
	if (b.Index != null) {
		this.IndexBuffer = gl.createBuffer();
		if (this.IndexBuffer == null) {
			this.Remove();
			return false
		}
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.IndexBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(b.Index), a)
	}
	return true
};
GLVertexBufferObject.prototype.Remove = function() {
	if (this.VertexBuffer != null) {
		gl.deleteBuffer(this.VertexBuffer);
		this.VertexBuffer = null
	}
	if (this.UvBuffer != null) {
		gl.deleteBuffer(this.UvBuffer);
		this.UvBuffer = null
	}
	if (this.NormalBuffer != null) {
		gl.deleteBuffer(this.NormalBuffer);
		this.NormalBuffer = null
	}
	if (this.IndexBuffer != null) {
		gl.deleteBuffer(this.IndexBuffer);
		this.IndexBuffer = null
	}
	this.Mesh = null
};
GLVertexBufferObject.prototype.UpdateVertexBuffer = function() {
	gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.Mesh.VertexPoint),
			this.Type)
};
GLVertexBufferObject.prototype.UpdateNormalBuffer = function() {
	gl.bindBuffer(gl.ARRAY_BUFFER, this.NormalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.Mesh.Normal),
			this.Type)
};
GLVertexBufferObject.prototype.UpdateColourBuffer = function() {
	gl.bindBuffer(gl.ARRAY_BUFFER, this.ColourBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.Mesh.Colour),
			this.Type)
};
function GLTexture() {
	this.Texture = null;
	this.Filter = {
		WrapClamp : gl.CLAMP,
		WrapClampEdge : gl.CLAMP_TO_EDGE,
		WrapRepeat : gl.REPEAT,
		FilterNearest : gl.NEAREST,
		FilterLinear : gl.LINEAR
	};
	this.Format = {
		Grayscale : gl.LUMINANCE,
		GrayscaleAlpha : gl.LUMINANCE_ALPHA,
		RGB : gl.RGB,
		RGBA : gl.RGBA,
		Depth : gl.DEPTH_COMPONENT,
		Depth16 : gl.DEPTH_COMPONENT16,
		Depth24 : gl.DEPTH_COMPONENT24,
		Depth32 : gl.DEPTH_COMPONENT32,
		GrayscaleF : gl.LUMINANCE32F_ARB,
		GrayscaleAlphaF : gl.LUMINANCE_ALPHA32F_ARB,
		RGBF : gl.RGB32F_ARB,
		RGBAF : gl.RGBA32F_ARB,
		Depth32F : gl.DEPTH_COMPONENT32F
	};
	this.Depth = {
		Byte : gl.UNSIGNED_BYTE,
		Short : gl.UNSIGNED_SHORT,
		Int : gl.UNSIGNED_INT,
		Float : gl.FLOAT
	}
}
GLTexture.prototype.Create = function(b, j, g, i, d, e, a, c) {
	var f = this.Depth.Byte;
	if (((i / 8) / g) == 2) {
		f = this.Depth.Short
	} else {
		if (((i / 8) / g) == 4) {
			f = this.Depth.Float
		}
	}
	var h = this.Format.RGB;
	if (g == 1) {
		h = (f == this.Depth.Float) ? this.Format.GrayscaleF
				: this.Format.Grayscale
	} else {
		if (g == 2) {
			h = (f == this.Depth.Float) ? this.Format.GrayscaleAlphaF
					: this.Format.GrayscaleAlpha
		} else {
			if (g == 3) {
				h = (f == this.Depth.Float) ? this.Format.RGBF
						: this.Format.RGB
			} else {
				if (g == 4) {
					h = (f == this.Depth.Float) ? this.Format.RGBAF
							: this.Format.RGBA
				}
			}
		}
	}
	this.CreateTexture(b, j, h, f, d, e, a, c)
};
GLTexture.prototype.CreateTexture = function(b, h, g, f, d, e, a, c) {
	this.Release();
	this.Texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, this.Texture);
	gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, e);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, e);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, a);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, a);
	var i = null;
	if ((g == this.Format.Grayscale) || (g == this.Format.GrayscaleF)) {
		i = gl.LUMINANCE
	} else {
		if ((g == this.Format.GrayscaleAlpha)
				|| (g == this.Format.GrayscaleAlphaF)) {
			i = gl.LUMINANCE_ALPHA
		} else {
			if ((g == this.Format.RGB) || (g == this.Format.RGBF)) {
				i = gl.RGB
			} else {
				if ((g == this.Format.RGBA) || (g == this.Format.RGBAF)) {
					i = gl.RGBA
				} else {
					if ((g == this.Format.Depth) || (g == this.Format.Depth16)
							|| (g == this.Format.Depth24)
							|| (g == this.Format.Depth32)
							|| (g == this.Format.Depth32F)) {
						i = gl.DEPTH_COMPONENT
					}
				}
			}
		}
	}
	if (d == null) {
		gl.texImage2D(gl.TEXTURE_2D, 0, g, b, h, 0, i, f, null)
	} else {
		gl.texImage2D(gl.TEXTURE_2D, 0, g, i, f, d)
	}
	if (c) {
		gl.generateMipmap(gl.TEXTURE_2D)
	}
};
GLTexture.prototype.Release = function() {
	if (this.Texture != null) {
		gl.deleteTexture(this.Texture);
		this.Texture = null
	}
};
function FrameBufferObject() {
	this.TextureFormat = null;
	this.TextureDepth = null;
	this.IsTexture = false;
	this.IsLinearFiltered = false;
	this.Id = null;
	this.Texture = null
}
function GLFrameBufferObject() {
	this.State = {
		Read : 0,
		Write : 1,
		ReadWrite : 2
	};
	this.mFrameBufferID = null;
	this.mFrameWidth = null;
	this.mFrameHeight = null;
	this.mColourBuffer = null;
	this.mDepthBuffer = null;
	this.mStencilBuffer = null
}
GLFrameBufferObject.prototype.Create = function(b, a, d, e, c) {
	this.Release();
	this.mFrameWidth = b;
	this.mFrameHeight = a;
	if (d != null) {
		this.mColourBuffer = d;
		if (this.mColourBuffer.IsTexture) {
			this.mColourBuffer.Texture = new GLTexture();
			this.mColourBuffer.Texture
					.CreateTexture(
							this.mFrameWidth,
							this.mFrameHeight,
							this.mColourBuffer.TextureFormat,
							this.mColourBuffer.TextureDepth,
							null,
							this.mColourBuffer.Texture.Filter.WrapClampEdge,
							this.mColourBuffer.IsLinearFiltered ? this.mColourBuffer.Texture.Filter.FilterLinear
									: this.mColourBuffer.Texture.Filter.FilterNearest,
							false);
			this.mColourBuffer.Id = this.mColourBuffer.Texture.Texture;
			if (this.mColourBuffer.Id == null) {
				this.Release();
				return false
			}
		} else {
			this.mColourBuffer.Id = gl.createRenderbuffer();
			if (this.mColourBuffer.Id == 0) {
				this.Release();
				return false
			}
			gl.bindRenderbuffer(gl.RENDERBUFFER, this.mColourBuffer.Id);
			gl.renderbufferStorage(gl.RENDERBUFFER,
					this.mColourBuffer.TextureFormat, this.mFrameWidth,
					this.mFrameHeight)
		}
	}
	if (e != null) {
		this.mDepthBuffer = e;
		if (this.mDepthBuffer.IsTexture) {
			this.mDepthBuffer.Texture = new GLTexture();
			this.mDepthBuffer.Texture
					.CreateTexture(
							this.mFrameWidth,
							this.mFrameHeight,
							this.mDepthBuffer.TextureFormat,
							this.mDepthBuffer.TextureDepth,
							null,
							this.mDepthBuffer.Texture.Filter.WrapClampEdge,
							this.mDepthBuffer.IsLinearFiltered ? this.mDepthBuffer.Texture.Filter.FilterLinear
									: this.mDepthBuffer.Texture.Filter.FilterNearest,
							false);
			this.mDepthBuffer.Id = this.mDepthBuffer.Texture.Texture;
			if (this.mDepthBuffer.Id == null) {
				this.Release();
				return false
			}
		} else {
			this.mDepthBuffer.Id = gl.createRenderbuffer();
			if (this.mDepthBuffer.Id == null) {
				this.Release();
				return false
			}
			gl.bindRenderbuffer(gl.RENDERBUFFER, this.mDepthBuffer.Id);
			gl.renderbufferStorage(gl.RENDERBUFFER,
					this.mDepthBuffer.TextureFormat, this.mFrameWidth,
					this.mFrameHeight)
		}
	}
	if (c != null) {
		this.mStencilBuffer = c;
		if (this.mStencilBuffer.IsTexture) {
			this.Release();
			return false
		} else {
			this.mStencilBuffer.Id = gl.createRenderbuffer();
			if (this.mStencilBuffer.Id == 0) {
				this.Release();
				return false
			}
			gl.bindRenderbuffer(gl.RENDERBUFFER, this.mStencilBuffer.Id);
			gl.renderbufferStorage(gl.RENDERBUFFER,
					this.mStencilBuffer.TextureFormat, this.mFrameWidth,
					this.mFrameHeight)
		}
	}
	gl.bindRenderbuffer(gl.RENDERBUFFER, null);
	this.mFrameBufferID = gl.createFramebuffer();
	if (this.mFrameBufferID == null) {
		this.Release();
		return false
	}
	gl.bindFramebuffer(gl.FRAMEBUFFER, this.mFrameBufferID);
	if ((d != null) && this.mColourBuffer.IsTexture) {
		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0,
				gl.TEXTURE_2D, this.mColourBuffer.Id, 0)
	} else {
		if (d != null) {
			gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0,
					gl.RENDERBUFFER, this.mColourBuffer.Id)
		}
	}
	if ((e != null) && this.mDepthBuffer.IsTexture) {
		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT,
				gl.TEXTURE_2D, this.mDepthBuffer.Id, 0)
	} else {
		if (e != null) {
			gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT,
					gl.RENDERBUFFER, this.mDepthBuffer.Id)
		}
	}
	if ((c != null) && this.mStencilBuffer.IsTexture) {
		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.STENCIL_ATTACHMENT,
				gl.TEXTURE_2D, this.mStencilBuffer.Id, 0)
	} else {
		if (c != null) {
			gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.STENCIL_ATTACHMENT,
					gl.RENDERBUFFER, this.mStencilBuffer.Id)
		}
	}
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	return true
};
GLFrameBufferObject.prototype.Release = function() {
	if (this.mColourBuffer != null) {
		if (this.mColourBuffer.IsTexture) {
			this.mColourBuffer.Texture.Release()
		} else {
			gl.deleteRenderbuffer(this.mColourBuffer.Id)
		}
		this.mColourBuffer = null
	}
	if (this.mDepthBuffer != null) {
		if (this.mDepthBuffer.IsTexture) {
			this.mDepthBuffer.Texture.Release()
		} else {
			gl.deleteRenderbuffer(this.mDepthBuffer.Id)
		}
		this.mDepthBuffer = null
	}
	if (this.mStencilBuffer != null) {
		if (this.mStencilBuffer.IsTexture) {
			this.mStencilBuffer.Texture.Release()
		} else {
			gl.deleteRenderbuffer(this.mStencilBuffer.Id)
		}
		this.mStencilBuffer = null
	}
	if (this.mFrameBufferID != null) {
		gl.deleteFramebuffer(this.mFrameBufferID)
	}
	this.mFrameWidth = 0;
	this.mFrameHeight = 0
};
GLFrameBufferObject.prototype.Enable = function(b, a) {
	gl.bindFramebuffer(gl.FRAMEBUFFER, a ? this.mFrameBufferID : null)
};
GLFrameBufferObject.prototype.Blit = function(b, f, e, c, m, j, h, l, g, a, d,
		k, i) {
};
GLFrameBufferObject.prototype.GetColourId = function() {
	return this.mColourBuffer.Id
};
GLFrameBufferObject.prototype.GetDepthId = function() {
	return this.mDepthBuffer.Id
};
GLFrameBufferObject.prototype.GetStencilId = function() {
	return this.mStencilBuffer.Id
};
GLFrameBufferObject.prototype.GetFrameBufferId = function() {
	return this.mFrameBufferID
};
GLFrameBufferObject.prototype.GetFrameWidth = function() {
	return this.mFrameWidth
};
GLFrameBufferObject.prototype.GetFrameHeight = function() {
	return this.mFrameHeight
};
function GLDraw() {
}
GLDraw.prototype.Draw = function(d, b, a, c) {
	if (a == null) {
		a = b.Mesh.GetNumPoints()
	}
	if (c == null) {
		c = b.Mesh.GetNumIndices()
	}
	gl.bindBuffer(gl.ARRAY_BUFFER, b.VertexBuffer);
	gl.vertexAttribPointer(d.VertexPointer, 3, gl.FLOAT, false, 0, 0);
	if (d.UvPointer != null) {
		gl.bindBuffer(gl.ARRAY_BUFFER, b.UvBuffer);
		gl.vertexAttribPointer(d.UvPointer, 2, gl.FLOAT, false, 0, 0)
	}
	if (b.NormalBuffer != null) {
		gl.bindBuffer(gl.ARRAY_BUFFER, b.NormalBuffer);
		gl.vertexAttribPointer(d.NormalPointer, 3, gl.FLOAT, false, 0, 0)
	}
	if (b.ColourBuffer != null) {
		gl.bindBuffer(gl.ARRAY_BUFFER, b.ColourBuffer);
		gl.vertexAttribPointer(d.ColourPointer, 4, gl.FLOAT, false, 0, 0)
	}
	if (b.Mesh.Index != null) {
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, b.IndexBuffer);
		gl.drawElements(gl.TRIANGLES, c, gl.UNSIGNED_SHORT, 0)
	} else {
		gl.drawArrays(gl.TRIANGLES, 0, b.Mesh.GetNumPoints())
	}
};
function GLParticleEmitter() {
	ParticleEmitter.call(this);
	this.Mesh = new PolygonMesh();
	this.VBO = new GLVertexBufferObject();
	this.ParticleCount = 0;
	this.ParticleFadeIn = 0.25;
	this.ParticleFadeOut = 0.25
}
GLParticleEmitter.prototype = new ParticleEmitter();
GLParticleEmitter.prototype.constructor = GLParticleEmitter;
GLParticleEmitter.prototype.Create = function(c) {
	this.MaxParticles = c;
	this.Mesh.Create(this.MaxParticles * 4, this.MaxParticles * 6);
	var a = this.Mesh.UV.length;
	for ( var b = 0; b < a; b += 8) {
		this.Mesh.UV[b + 0] = 0;
		this.Mesh.UV[b + 1] = 0;
		this.Mesh.UV[b + 2] = 1;
		this.Mesh.UV[b + 3] = 0;
		this.Mesh.UV[b + 4] = 1;
		this.Mesh.UV[b + 5] = 1;
		this.Mesh.UV[b + 6] = 0;
		this.Mesh.UV[b + 7] = 1
	}
	this.Mesh.Normal = null;
	this.Mesh.Colour = new Array((this.Mesh.VertexPoint.length / 3) * 4);
	for ( var b = 0; b < this.Mesh.Colour.length; b += 4) {
		this.Mesh.Colour[b] = 1;
		this.Mesh.Colour[b + 1] = 1;
		this.Mesh.Colour[b + 2] = 1;
		this.Mesh.Colour[b + 3] = 1
	}
	var e = 0;
	var d = this.Mesh.Index.length;
	for ( var b = 0; b < d; b += 6) {
		this.Mesh.Index[b + 0] = e;
		this.Mesh.Index[b + 1] = e + 1;
		this.Mesh.Index[b + 2] = e + 2;
		this.Mesh.Index[b + 3] = e + 2;
		this.Mesh.Index[b + 4] = e + 3;
		this.Mesh.Index[b + 5] = e;
		e += 4
	}
	this.VBO.Create(this.Mesh, this.VBO.BufferType.Dynamic)
};
GLParticleEmitter.prototype.Simulate = function(h) {
	ParticleEmitter.prototype.Simulate.call(this, h);
	var d = 0;
	var b = 0;
	var g = 1;
	var a = new Point(0, 0, 0, 1);
	var c = new Matrix(4, 4);
	for ( var e = 0; e < this.mParticle.length; ++e) {
		var f = this.mParticle[e];
		c.Rotate(f.Rotation.x, f.Rotation.y, f.Rotation.z);
		c.Translate(f.Position.x, f.Position.y, f.Position.z);
		a.SetPoint(-f.Scale.x, -f.Scale.y, 0, 1);
		a = c.PointMultiply(a);
		this.Mesh.VertexPoint[d] = a.x;
		this.Mesh.VertexPoint[d + 1] = a.y;
		this.Mesh.VertexPoint[d + 2] = a.z;
		a.SetPoint(f.Scale.x, -f.Scale.y, 0, 1);
		a = c.PointMultiply(a);
		this.Mesh.VertexPoint[d + 3] = a.x;
		this.Mesh.VertexPoint[d + 4] = a.y;
		this.Mesh.VertexPoint[d + 5] = a.z;
		a.SetPoint(f.Scale.x, f.Scale.y, 0, 1);
		a = c.PointMultiply(a);
		this.Mesh.VertexPoint[d + 6] = a.x;
		this.Mesh.VertexPoint[d + 7] = a.y;
		this.Mesh.VertexPoint[d + 8] = a.z;
		a.SetPoint(-f.Scale.x, f.Scale.y, 0, 1);
		a = c.PointMultiply(a);
		this.Mesh.VertexPoint[d + 9] = a.x;
		this.Mesh.VertexPoint[d + 10] = a.y;
		this.Mesh.VertexPoint[d + 11] = a.z;
		g = 1;
		if (f.LifeTime < this.ParticleFadeIn) {
			g = f.LifeTime / this.ParticleFadeIn
		} else {
			if (f.LifeTime > (f.Life - this.ParticleFadeOut)) {
				g = (f.Life - f.LifeTime) / this.ParticleFadeOut
			}
		}
		this.Mesh.Colour[b + 3] = g;
		this.Mesh.Colour[b + 7] = g;
		this.Mesh.Colour[b + 11] = g;
		this.Mesh.Colour[b + 15] = g;
		d += 12;
		b += 16
	}
	this.ParticleCount = this.mParticle.length * 6;
	this.VBO.UpdateVertexBuffer();
	this.VBO.UpdateColourBuffer()
};
function GLBasicShader() {
	GLShaderProgram.call(this);
	this.mAttribVertex;
	this.mAttribUv;
	this.mAttribNormal;
	this.mAttribColour
}
GLBasicShader.prototype = new GLShaderProgram();
GLBasicShader.prototype.constructor = GLBasicShader;
GLBasicShader.prototype.Enable = function() {
	this.Load();
	this.mAttribVertex = this.GetAttribute("Vertex");
	if (this.mAttribVertex != null) {
		gl.enableVertexAttribArray(this.mAttribVertex)
	}
	this.mAttribUv = this.GetAttribute("Uv");
	if (this.mAttribUv != null) {
		gl.enableVertexAttribArray(this.mAttribUv)
	}
	this.mAttribNormal = this.GetAttribute("Normal");
	if (this.mAttribNormal != null) {
		gl.enableVertexAttribArray(this.mAttribNormal)
	}
	this.mAttribColour = this.GetAttribute("Colour");
	if (this.mAttribColour != null) {
		gl.enableVertexAttribArray(this.mAttribColour)
	}
};
GLBasicShader.prototype.Disable = function() {
	if (this.mAttribVertex != null) {
		gl.disableVertexAttribArray(this.mAttribVertex)
	}
	if (this.mAttribUv != null) {
		gl.disableVertexAttribArray(this.mAttribUv)
	}
	if (this.mAttribNormal != null) {
		gl.disableVertexAttribArray(this.mAttribNormal)
	}
	if (this.mAttribColour != null) {
		gl.disableVertexAttribArray(this.mAttribColour)
	}
};
GLBasicShader.prototype.Draw = function(b, a, c) {
	if (this.mAttribVertex != null) {
		gl.bindBuffer(gl.ARRAY_BUFFER, b.VertexBuffer);
		gl.vertexAttribPointer(this.mAttribVertex, 3, gl.FLOAT, false, 0, 0)
	}
	if (this.mAttribUv != null) {
		gl.bindBuffer(gl.ARRAY_BUFFER, b.UvBuffer);
		gl.vertexAttribPointer(this.mAttribUv, 2, gl.FLOAT, false, 0, 0)
	}
	if (this.mAttribNormal != null) {
		gl.bindBuffer(gl.ARRAY_BUFFER, b.NormalBuffer);
		gl.vertexAttribPointer(this.mAttribNormal, 3, gl.FLOAT, false, 0, 0)
	}
	if (this.mAttribColour != null) {
		gl.bindBuffer(gl.ARRAY_BUFFER, b.ColourBuffer);
		gl.vertexAttribPointer(this.mAttribColour, 4, gl.FLOAT, false, 0, 0)
	}
	if (b.IndexBuffer != null) {
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, b.IndexBuffer);
		gl.drawElements(gl.TRIANGLES, (c != null) ? c : b.Mesh.GetNumIndices(),
				gl.UNSIGNED_SHORT, 0)
	} else {
		glDrawArrays(gl.TRIANGLES, 0, (a != null) ? a : b.Mesh.GetNumPoints())
	}
};
function Scene(a) {
	this.mSceneName = a;
	this.mSceneManager
}
Scene.prototype.Start = function() {
};
Scene.prototype.Update = function() {
};
Scene.prototype.End = function() {
};
Scene.prototype.SetScene = function(a) {
	if (this.mSceneManager != null) {
		this.mSceneManager.SetScene(a)
	}
};
Scene.prototype.SetSceneManager = function(a) {
	this.mSceneManager = a
};
Scene.prototype.GetSceneName = function() {
	return this.mSceneName
};
function SceneManager() {
	this.mScene = new Array();
	this.mCurrentScene;
	this.OnSceneChange = new Event()
}
SceneManager.prototype.Add = function(a) {
	a.SetSceneManager(this);
	this.mScene.push(a)
};
SceneManager.prototype.Remove = function(a) {
	for ( var b = 0; b < this.mScene.length; ++b) {
		if (this.mScene[b].GetSceneName() == a) {
			this.mScene.splice(b, 1);
			break
		}
	}
};
SceneManager.prototype.GetCurrentScene = function() {
	return this.mCurrentScene
};
SceneManager.prototype.FindScene = function(a) {
	for ( var b = 0; b < this.mScene.length; ++b) {
		if (this.mScene[b].GetSceneName() == a) {
			return this.mScene[b]
		}
	}
	return null
};
SceneManager.prototype.Clear = function() {
	if (this.mCurrentScene != null) {
		this.mCurrentScene.End()
	}
	this.mCurrentScene = null;
	this.mScene = new Array()
};
SceneManager.prototype.SetScene = function(a) {
	if (this.mCurrentScene != null) {
		this.mCurrentScene.End()
	}
	this.mCurrentScene = this.FindScene(a);
	if (this.mCurrentScene != null) {
		this.mCurrentScene.Start()
	}
	this.OnSceneChange.Dispatch(a)
};
SceneManager.prototype.Update = function() {
	if (this.mCurrentScene != null) {
		this.mCurrentScene.Update()
	}
};
function AppInitCommand() {
	ICommand.call(this)
}
AppInitCommand.prototype = new ICommand();
AppInitCommand.prototype.constructor = AppInitCommand;
AppInitCommand.prototype.Execute = function(a) {
	Controller.Set("AppClosingEvent", new AppClosingCommand());
	Controller.Set("AppUnhandledExceptionEvent",
			new AppUnhandledExceptionCommand());
	Controller.Set("LogEvent", new LogCommand());
	Controller.Set("ErrorEvent", new ErrorCommand());
	Controller.Set("SaveUserDataEvent", new SaveUserDataCommand());
	Controller.Set("LoadUserDataEvent", new LoadUserDataCommand());
	Controller.Set("SetLocaleEvent", new SetLocaleCommand());
	Controller.Set("LoadSceneEvent", new LoadSceneCommand());
	Controller.Set("NavigateBackEvent", new NavigateBackCommand());
	Controller.Set("NavigateToEvent", new NavigateToCommand());
	new LoadUserDataEvent().Dispatch();
	AppModel.Instance().Manager.Add(new MainScene());
	new NavigateToEvent("MainScene", false).Dispatch()
};
function AppClosingCommand() {
	ICommand.call(this)
}
AppClosingCommand.prototype = new ICommand();
AppClosingCommand.prototype.constructor = AppClosingCommand;
AppClosingCommand.prototype.Execute = function(a) {
	new SaveUserDataEvent().Dispatch()
};
function AppUnhandledExceptionCommand() {
	ICommand.call(this)
}
AppUnhandledExceptionCommand.prototype = new ICommand();
AppUnhandledExceptionCommand.prototype.constructor = AppUnhandledExceptionCommand;
AppUnhandledExceptionCommand.prototype.Execute = function(a) {
};
function ErrorCommand() {
	ICommand.call(this)
}
ErrorCommand.prototype = new ICommand();
ErrorCommand.prototype.constructor = ErrorCommand;
ErrorCommand.prototype.Execute = function(a) {
};
function LoadUserDataCommand() {
	ICommand.call(this)
}
LoadUserDataCommand.prototype = new ICommand();
LoadUserDataCommand.prototype.constructor = LoadUserDataCommand;
LoadUserDataCommand.prototype.Execute = function(a) {
};
function LogCommand() {
	ICommand.call(this)
}
LogCommand.prototype = new ICommand();
LogCommand.prototype.constructor = LogCommand;
LogCommand.prototype.Execute = function(a) {
};
function SaveUserDataCommand() {
	ICommand.call(this)
}
SaveUserDataCommand.prototype = new ICommand();
SaveUserDataCommand.prototype.constructor = SaveUserDataCommand;
SaveUserDataCommand.prototype.Execute = function(a) {
};
function SetLocaleCommand() {
	ICommand.call(this)
}
SetLocaleCommand.prototype = new ICommand();
SetLocaleCommand.prototype.constructor = SetLocaleCommand;
SetLocaleCommand.prototype.Execute = function(c) {
	if (c.LocaleCode.length == null) {
		c.LocaleCode = "en"
	}
	var a = AppModel.Instance();
	var b;
	for (b = 0; b < a.SupportedLocale.length; ++b) {
		if (a.SupportedLocale[b].LocaleCode == c.LocaleCode) {
			break
		}
	}
	if ((b == a.SupportedLocale.length) && (a.SupportedLocale.length > 0)) {
	}
};
function LoadSceneCommand() {
	ICommand.call(this)
}
LoadSceneCommand.prototype = new ICommand();
LoadSceneCommand.prototype.constructor = LoadSceneCommand;
LoadSceneCommand.prototype.Execute = function(a) {
	AppModel.LoadScene = AppModel.Manager.FindScene(a.SceneName);
	new NavigateToEvent("loading").Dispatch()
};
function NavigateBackCommand() {
	ICommand.call(this)
}
NavigateBackCommand.prototype = new ICommand();
NavigateBackCommand.prototype.constructor = NavigateBackCommand;
NavigateBackCommand.prototype.Execute = function(c) {
	var b = AppModel.Instance();
	if (b.SceneHistory.length > 0) {
		var a = b.SceneHistory.pop();
		b.Manager.SetScene(a)
	}
};
function NavigateToCommand() {
	ICommand.call(this)
}
NavigateToCommand.prototype = new ICommand();
NavigateToCommand.prototype.constructor = NavigateToCommand;
NavigateToCommand.prototype.Execute = function(c) {
	var a = AppModel.Instance();
	var b = a.Manager.GetCurrentScene();
	if (c.IncludeInHistory && b && (b.GetSceneName() != c.SceneName)) {
		a.SceneHistory.push(c.GetSceneName())
	}
	a.Manager.SetScene(c.SceneName)
};
function AppInitEvent() {
	EventDispatcher.call(this, "AppInitEvent")
}
AppInitEvent.prototype = new EventDispatcher();
AppInitEvent.prototype.constructor = AppInitEvent;
function AppClosingEvent(a) {
	EventDispatcher.call(this, "AppClosingEvent")
}
AppClosingEvent.prototype = new EventDispatcher();
AppClosingEvent.prototype.constructor = AppClosingEvent;
function AppUnhandledExceptionEvent(a) {
	EventDispatcher.call(this, "AppUnhandledExceptionEvent");
	this.Error = a
}
AppUnhandledExceptionEvent.prototype = new EventDispatcher();
AppUnhandledExceptionEvent.prototype.constructor = AppUnhandledExceptionEvent;
function ErrorEvent(b, a) {
	EventDispatcher.call(this, "ErrorEvent");
	this.Message = b;
	this.Error = a
}
ErrorEvent.prototype = new EventDispatcher();
ErrorEvent.prototype.constructor = ErrorEvent;
function LoadUserDataEvent() {
	EventDispatcher.call(this, "LoadUserDataEvent")
}
LoadUserDataEvent.prototype = new EventDispatcher();
LoadUserDataEvent.prototype.constructor = LoadUserDataEvent;
function LogEvent(b, a) {
	EventDispatcher.call(this, "LogEvent");
	this.Data = b;
	this.Severity = a
}
LogEvent.prototype = new EventDispatcher();
LogEvent.prototype.constructor = LogEvent;
function SaveUserDataEvent() {
	EventDispatcher.call(this, "SaveUserDataEvent")
}
SaveUserDataEvent.prototype = new EventDispatcher();
SaveUserDataEvent.prototype.constructor = SaveUserDataEvent;
function SetLocaleEvent(a) {
	EventDispatcher.call(this, "SetLocaleEvent");
	this.LocaleCode = a
}
SetLocaleEvent.prototype = new EventDispatcher();
SetLocaleEvent.prototype.constructor = SetLocaleEvent;
function LoadSceneEvent(a) {
	EventDispatcher.call(this, "LoadSceneEvent");
	this.SceneName = a
}
LoadSceneEvent.prototype = new EventDispatcher();
LoadSceneEvent.prototype.constructor = LoadSceneEvent;
function NavigateBackEvent() {
	EventDispatcher.call(this, "NavigateBackEvent")
}
NavigateBackEvent.prototype = new EventDispatcher();
NavigateBackEvent.prototype.constructor = NavigateBackEvent;
function NavigateToEvent(b, a) {
	EventDispatcher.call(this, "NavigateToEvent");
	this.SceneName = b;
	this.IncludeInHistory = a ? a : false
}
NavigateToEvent.prototype = new EventDispatcher();
NavigateToEvent.prototype.constructor = NavigateToEvent;
function AppModel() {
	DataObject.call(this);
	this.Config = new DataObject();
	this.CurrentLocale = new Locale();
	this.SupportedLocale = new Array();
	this.Manager = new SceneManager();
	this.SceneHistory = new Array();
	this.LoadScene = null
}
AppModel.prototype = new DataObject();
AppModel.prototype.constructor = AppModel;
AppModel.mInstance = null;
AppModel.Instance = function() {
	if (AppModel.mInstance == null) {
		AppModel.mInstance = new AppModel()
	}
	return AppModel.mInstance
};
AppModel.prototype.SampleProperty = function(a) {
	if (a == null) {
		return this.GetValue("SampleProperty")
	} else {
		this.SetValue("SampleProperty", a)
	}
};
function SupportedLocaleModel(b, a) {
	this.Path = b;
	this.LocaleCode = a
}
function MainScene() {
	Scene.call(this, "MainScene");
	this.mProjection;
	this.mOrthoProjection;
	this.mView;
	this.mOrthoView;
	this.mMesh;
	this.mColourShader;
	this.mBasicShader;
	this.mDepthShader;
	this.mDOFShader;
	this.mMouseLeft = false;
	this.mMouseRight = false;
	this.mMouseMove = false;
	this.mLastMousePos = new Point();
	this.mStoryboard = new StoryboardManager();
	this.mRenderDepthTexture;
	this.mRenderColourTexture;
	this.mAngle = 0;
	this.mViewRot = new Point(-0.7, 0, 7);
	this.mCanvas;
	this.mOrthoRect;
	this.mChkMoveCamera;
	this.mChkShowDepth
}
MainScene.prototype = new Scene();
MainScene.prototype.constructor = MainScene;
MainScene.prototype.OnKeyboardKeyDown = function(a) {
	if (a.keyCode == 87) {
	} else {
		if (a.keyCode == 83) {
		} else {
			if (a.keyCode == 65) {
			} else {
				if (a.keyCode == 68) {
				}
			}
		}
	}
};
MainScene.prototype.OnKeyboardKeyUp = function(a) {
	if ((a.keyCode == 87) || (a.keyCode == 83)) {
	} else {
		if ((a.keyCode == 65) || (a.keyCode == 68)) {
		}
	}
};
MainScene.prototype.OnMouseDown = function(a) {
	this.MouseState.mLastMousePos.x = a.clientX;
	this.MouseState.mLastMousePos.y = a.clientY;
	this.MouseState.mMouseLeft = true
};
MainScene.prototype.OnMouseUp = function(a) {
	this.MouseState.mMouseLeft = false
};
MainScene.prototype.OnMouse = function(b) {
	if (this.MouseState.mMouseLeft) {
		var a = (this.MouseState.mLastMousePos.x - b.clientX) * 0.01;
		var c = (this.MouseState.mLastMousePos.y - b.clientY) * 0.1;
		this.MouseState.mViewRot.x += a;
		this.MouseState.mViewRot.z += c;
		if (this.MouseState.mViewRot.z < 1) {
			this.MouseState.mViewRot.z = 1
		} else {
			if (this.MouseState.mViewRot.z > 15) {
				this.MouseState.mViewRot.z = 15
			}
		}
		this.MouseState.mView.PointAt(new Point(Math
				.sin(this.MouseState.mViewRot.x)
				* this.MouseState.mViewRot.z, this.MouseState.mViewRot.y, Math
				.cos(this.MouseState.mViewRot.x)
				* this.MouseState.mViewRot.z), new Point(0,
				this.MouseState.mViewRot.y, 0));
		this.MouseState.mView = this.MouseState.mView.Inverse();
		this.MouseState.mLastMousePos.x = b.clientX;
		this.MouseState.mLastMousePos.y = b.clientY
	}
};
MainScene.prototype.Start = function() {
	Scene.prototype.Start.call(this);
	this.mCanvas = document.getElementById("glCanvas");
	this.mChkMoveCamera = document.getElementById("ChkMoveCamera");
	this.mChkShowDepth = document.getElementById("ChkShowDepth");
	this.mProjection = ViewMatrix.Perspective(45, this.mCanvas.width
			/ this.mCanvas.height, 0.1, 255);
	this.mOrthoProjection = ViewMatrix.Orthographic(1, 1, 0.1, 255);
	this.mView = new Matrix(4, 4);
	this.mView
			.PointAt(new Point(Math.sin(this.mViewRot.x) * 7, this.mViewRot.y,
					Math.cos(this.mViewRot.x) * 7), new Point(0, 0, 0));
	this.mView = this.mView.Inverse();
	this.mOrthoView = new Matrix(4, 4);
	this.mOrthoView.Translate(0, 0, -1);
	this.mOrthoView = this.mOrthoView.Inverse();
	document.onkeydown = this.OnKeyboardKeyDown;
	document.onkeyup = this.OnKeyboardKeyUp;
	this.mCanvas.MouseState = this;
	this.mCanvas.onmousedown = this.OnMouseDown;
	this.mCanvas.onmouseup = this.OnMouseUp;
	this.mCanvas.onmousemove = this.OnMouse;
	gl.clearColor(1, 1, 1, 1);
	gl.clearDepth(1);
	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL);
	gl.activeTexture(gl.TEXTURE0);
	this.mMesh = new Array();
	for ( var v = -2; v <= 2; ++v) {
		for ( var t = -2; t <= 2; ++t) {
			for ( var r = -2; r <= 2; ++r) {
				if ((v != 0) || (t != 0) || (r != 0)) {
					var h = new Sphere(10, 10, 0.25, 0);
					h.ObjectMaterial.Ambient.SetPoint(0, 0, 0);
					h.ObjectMaterial.Diffuse.SetPoint(0.8, 0.8, 0.8);
					h.ObjectMaterial.Specular.SetPoint(0.8, 0.8, 0.8);
					h.ObjectMaterial.Shininess = 64;
					h.SetPosition(v * 3, t * 3, r * 3);
					var l = new GLVertexBufferObject();
					l.Create(h, l.BufferType.Static);
					this.mMesh.push(l)
				}
			}
		}
	}
	this.OnHttpResponse = function(k, i) {
		if (i.ResponseText != null) {
			var j = OBJ.Load(i.ResponseText);
			j.CreateNormals();
			j.ObjectMaterial.Ambient.SetPoint(0, 0, 0);
			j.ObjectMaterial.Diffuse.SetPoint(0.8, 0.4, 0.4);
			j.ObjectMaterial.Specular.SetPoint(0, 0, 0);
			j.SetPosition(-0.1, -0.2, 0);
			j.SetRotation(-65, 0, 0);
			l = new GLVertexBufferObject();
			l.Create(j, l.BufferType.Static);
			i.State.mMesh.push(l)
		}
	};
	var s = new HttpRequest(this.OnHttpResponse);
	s.SendRequest("GET", "resource/monkey.obj", null, this);
	var D = new Rectangle(1, 1);
	D.ObjectMaterial.Ambient.SetPoint(1, 1, 1);
	D.ObjectMaterial.Diffuse.SetPoint(0, 0, 0);
	D.ObjectMaterial.Specular.SetPoint(0, 0, 0);
	this.mOrthoRect = new GLVertexBufferObject();
	this.mOrthoRect.Create(D, this.mOrthoRect.BufferType.Static);
	var m = new GLTexture();
	var g = new FrameBufferObject();
	g.TextureFormat = m.Format.RGBA;
	g.TextureDepth = m.Depth.Byte;
	g.IsTexture = true;
	var A = new FrameBufferObject();
	A.TextureFormat = m.Format.Depth16;
	A.TextureDepth = m.Depth.Float;
	this.mRenderDepthTexture = new GLFrameBufferObject();
	this.mRenderDepthTexture.Create(this.mCanvas.width, this.mCanvas.height, g,
			A, null);
	var g = new FrameBufferObject();
	g.TextureFormat = m.Format.RGBA;
	g.TextureDepth = m.Depth.Byte;
	g.IsTexture = true;
	var A = new FrameBufferObject();
	A.TextureFormat = m.Format.Depth16;
	A.TextureDepth = m.Depth.Float;
	this.mRenderColourTexture = new GLFrameBufferObject();
	this.mRenderColourTexture.Create(this.mCanvas.width, this.mCanvas.height,
			g, A, null);
	var a = new Shader();
	var e = a.LoadShader("shader-vs", true);
	var q = a.LoadShader("shader-fs", false);
	var d = a.LoadShader("shader-depth-vs", true);
	var p = a.LoadShader("shader-depth-fs", false);
	var c = a.LoadShader("shader-dof-vs", true);
	var o = a.LoadShader("shader-dof-fs", false);
	var b = a.LoadShader("shader-colour-vs", true);
	var n = a.LoadShader("shader-colour-fs", false);
	this.mColourShader = new BasicShader();
	this.mColourShader.Create();
	this.mColourShader.AddShader(b);
	this.mColourShader.AddShader(n);
	this.mColourShader.LightVec = new Point(-1, -1, -1).Normalize();
	this.mBasicShader = new BasicShader();
	this.mBasicShader.Create();
	this.mBasicShader.AddShader(e);
	this.mBasicShader.AddShader(q);
	this.mDepthShader = new DepthShader();
	this.mDepthShader.Create();
	this.mDepthShader.AddShader(d);
	this.mDepthShader.AddShader(p);
	this.mDOFShader = new DOFShader();
	this.mDOFShader.Create();
	this.mDOFShader.AddShader(c);
	this.mDOFShader.AddShader(o);
	var C = new KeyframePoint(0, new Point(0, 0, 0));
	var B = new KeyframePoint(10, new Point(360, 0, 0));
	var u = new KeyframeAnimation();
	u.Easing = new CubicEase();
	u.Easing.Mode = EasingFunction.EaseInOut;
	u.Add(C);
	u.Add(B);
	var f = new Storyboard();
	f.Name = "Simple";
	f.Loop = true;
	f.Animation.push(u);
	f.OnUpdate.Add(MainScene.prototype.OnStoryUpdate, this);
	this.mStoryboard.AddStoryboard(f);
	this.mStoryboard.Play("Simple")
};
MainScene.prototype.OnStoryUpdate = function(a) {
	this.mMesh[1].Mesh.ObjectMatrix.Rotate(a[0].KeyPoint.x, a[0].KeyPoint.y,
			a[0].KeyPoint.z)
};
MainScene.prototype.Update = function() {
	Scene.prototype.Update.call(this);
	this.mDepthShader.Enable();
	this.mRenderDepthTexture.Enable(null, true);
	gl.viewport(0, 0, this.mRenderDepthTexture.GetFrameWidth(),
			this.mRenderDepthTexture.GetFrameHeight());
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	this.mDepthShader.Projection = this.mProjection;
	this.mDepthShader.View = this.mView;
	gl.activeTexture(gl.TEXTURE0);
	for ( var a = 0; a < this.mMesh.length; ++a) {
		this.mDepthShader.Draw(this.mMesh[a])
	}
	this.mRenderDepthTexture.Enable(null, false);
	this.mDepthShader.Disable();
	this.mColourShader.Enable();
	this.mRenderColourTexture.Enable(null, true);
	gl.viewport(0, 0, this.mRenderColourTexture.GetFrameWidth(),
			this.mRenderColourTexture.GetFrameHeight());
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	this.mColourShader.Projection = this.mProjection;
	this.mColourShader.View = this.mView;
	for ( var a = 0; a < this.mMesh.length; ++a) {
		this.mColourShader.Draw(this.mMesh[a])
	}
	this.mRenderColourTexture.Enable(null, false);
	this.mColourShader.Disable();
	gl.viewport(0, 0, this.mCanvas.width, this.mCanvas.height);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	if (this.mChkShowDepth.checked) {
		this.mBasicShader.Enable();
		this.mBasicShader.Projection = this.mOrthoProjection;
		this.mBasicShader.View = this.mOrthoView;
		gl.bindTexture(gl.TEXTURE_2D, this.mRenderDepthTexture.GetColourId());
		this.mBasicShader.Draw(this.mOrthoRect);
		this.mBasicShader.Disable()
	} else {
		this.mDOFShader.Enable();
		this.mDOFShader.Projection = this.mOrthoProjection;
		this.mDOFShader.View = this.mOrthoView;
		this.mDOFShader.SetVariableIntByName("Sample0", 0);
		this.mDOFShader.SetVariableIntByName("Sample1", 1);
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, this.mRenderDepthTexture.GetColourId());
		gl.activeTexture(gl.TEXTURE1);
		gl.bindTexture(gl.TEXTURE_2D, this.mRenderColourTexture.GetColourId());
		this.mDOFShader.Draw(this.mOrthoRect);
		this.mDOFShader.Disable()
	}
};
MainScene.prototype.End = function() {
	Scene.prototype.End.call(this);
	this.mProjection = null;
	this.mView = null;
	this.mMesh = null;
	document.onkeydown = null;
	document.onkeyup = null
};
function BasicShader() {
	GLBasicShader.call(this);
	this.mProjectionId;
	this.mViewId;
	this.mModelId;
	this.mLightVecId;
	this.mMatAmbientId;
	this.mMatDiffuseId;
	this.mMatEmissionId;
	this.mMatSpecularId;
	this.mMatShininessId;
	this.LightVec = new Point();
	this.Projection;
	this.View
}
BasicShader.prototype = new GLBasicShader();
BasicShader.prototype.constructor = BasicShader;
BasicShader.prototype.Enable = function() {
	GLBasicShader.prototype.Enable.call(this);
	this.mProjectionId = this.GetVariable("ProjectionMatrix");
	this.mViewId = this.GetVariable("ViewMatrix");
	this.mModelId = this.GetVariable("ModelMatrix");
	this.mLightVecId = this.GetVariable("LightVec");
	this.mMatAmbientId = this.GetVariable("MatAmbient");
	this.mMatDiffuseId = this.GetVariable("MatDiffuse");
	this.mMatEmissionId = this.GetVariable("MatEmission");
	this.mMatSpecularId = this.GetVariable("MatSpecular");
	this.mMatShininessId = this.GetVariable("MatShininess")
};
BasicShader.prototype.Draw = function(c, b, d) {
	this.SetMatrix(this.mProjectionId, this.Projection.MMatrix, 4);
	this.SetMatrix(this.mViewId, this.View.MMatrix, 4);
	this.SetMatrix(this.mModelId, c.Mesh.ObjectMatrix.MMatrix, 4);
	this.SetVariable(this.mLightVecId, this.LightVec.x, this.LightVec.y,
			this.LightVec.z);
	var a = c.Mesh.ObjectMaterial;
	this.SetVariable(this.mMatAmbientId, a.Ambient.x, a.Ambient.y, a.Ambient.z);
	this.SetVariable(this.mMatDiffuseId, a.Diffuse.x, a.Diffuse.y, a.Diffuse.z);
	this.SetVariable(this.mMatEmissionId, a.Emission.x, a.Emission.y,
			a.Emission.z);
	this.SetVariable(this.mMatSpecularId, a.Specular.x, a.Specular.y,
			a.Specular.z);
	this.SetVariable(this.mMatShininessId, a.Shininess);
	GLBasicShader.prototype.Draw.call(this, c, b, d)
};
function DepthShader() {
	GLBasicShader.call(this);
	this.mProjectionId;
	this.mViewId;
	this.mModelId;
	this.Projection;
	this.View
}
DepthShader.prototype = new GLBasicShader();
DepthShader.prototype.constructor = DepthShader;
DepthShader.prototype.Enable = function() {
	GLBasicShader.prototype.Enable.call(this);
	this.mProjectionId = this.GetVariable("ProjectionMatrix");
	this.mViewId = this.GetVariable("ViewMatrix");
	this.mModelId = this.GetVariable("ModelMatrix")
};
DepthShader.prototype.Draw = function(b, a, c) {
	this.SetMatrix(this.mProjectionId, this.Projection.MMatrix, 4);
	this.SetMatrix(this.mViewId, this.View.MMatrix, 4);
	this.SetMatrix(this.mModelId, b.Mesh.ObjectMatrix.MMatrix, 4);
	GLBasicShader.prototype.Draw.call(this, b, a, c)
};
function DOFShader() {
	BasicShader.call(this)
}
DOFShader.prototype = new BasicShader();
DOFShader.prototype.constructor = DOFShader;
DOFShader.prototype.Enable = function() {
	BasicShader.prototype.Enable.call(this)
};
DOFShader.prototype.Draw = function(b, a, c) {
	BasicShader.prototype.Draw.call(this, b, a, c)
};
function OnTimer() {
	try {
		Timer.SigTimer();
		AppModel.Instance().Manager.Update()
	} catch (a) {
		new AppUnhandledExceptionEvent(a).Dispatch()
	}
}
function AppStart() {
	try {
		var b = document.getElementById("glCanvas");
		gl = b.getContext("experimental-webgl");
		gl.viewportWidth = b.width;
		gl.viewportHeight = b.height;
		gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
		Controller.Set("AppInitEvent", new AppInitCommand());
		new AppInitEvent().Dispatch();
		setInterval(OnTimer, 1000 / 30)
	} catch (a) {
		new AppUnhandledExceptionEvent(a).Dispatch()
	}
}
function AppEnd() {
	new AppClosingEvent().Dispatch()
};