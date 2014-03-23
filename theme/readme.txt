http://bootswatch.com/cerulean/
//////////// settings//////
<h4>Settings Page {{tokenid}}</h4>
<div class="header" ng-controller="NavCtrl">
	<ul class="nav nav-pills">
		<li class="active"><a href="#/vehicle">Vehicle</a></li>
		<li><a href="#/route">Route</a></li>
		<li><a href="#/user/profile">Profile</a></li>
		<li><a href="" data-ng-click="logout()">Logout</a></li>
	</ul>
</div>

<form class='form'>
	<h2 class='form-heading'>Add vehicle</h2>
	<input class='form-control' placeholder="Vehicle Name" ng-model="vehicle.name" required>
	<input class="btn btn-large btn-primary" ng-click="saveVehicle()" value="Save"/>
</form>

	<table class="table table-condensed table-bordered table-hover">
		<thead>
			<tr>
				<th>name</th>
				<th>delete</th>
			</tr>
		</thead>
		<tbody>
			<tr ng-class-even="'even'" ng-repeat="vehicle in vehicles">
				<td><a href="#/mileage/{{vehicle._id}}">{{vehicle.name}}</a></td>
				<td><a class='btn btn-primary' ng-click='deleteVehicle(vehicle, $index)' ng-class='{disabled: index < 0}'>Delete</a></td>
			<tr>
		</tbody>
	</table>

///////////////////////////login //////////////////////////////
<form class="form" role="form" ng-submit="login()">
	<h2 class="form-heading">Please sign in</h2>
	<input type="email" class="form-control" placeholder="Email address" ng-model="credentials.username" required>
	<input type="password" class="form-control" placeholder="Password"  ng-model="credentials.password" required>
	<label class="checkbox">
		<input type="checkbox" value="remember-me"> Remember me
	</label>
	<a class="pull-right" href="/registration">register to join</a>
	<button class="btn btn-large btn-primary" type="submit">Sign in</button>
</form>

////////////////////////////////////////registration////////
        <h2 class="form-heading">registration</h2>
        <input type="firstname" class="form-control"  placeholder="First Name" ng-model="user.firstname" required>
        <input type="lastname" class="form-control"  placeholder="Last Name"  ng-model="user.lastname" required>
        <input type="email" class="form-control"  placeholder="Email address" ng-model="user.email" required>
        <input type="password" class="form-control"  placeholder="Password"  ng-model="user.password" required>
        <button class="btn btn-large btn-primary" type="submit">Submit</button>

/////////////////////mileages


				<div class="form-group">
					<div class="col-lg-10 col-lg-offset-2">
						
						<button type="submit" class="btn btn-primary">Save Mileage</button>
						<button class="btn btn-default" data-ng-click="logout()">Logout</button>
					</div>
				</div>
				
				
				
<h2>Mileage </h2>
<form ng-submit="saveMileage()" >
	<div>
		<label>start</label><input ng-model='mileage.start'>
	</div>
	<div>
		<label>end</label><input ng-model='mileage.end'>
	</div>
	<div>
		<label>date</label> <input ng-model="mileage.date">
	</div>
	<div>
		<label>type</label> <input ng-model="mileage.type">
	</div>
	<div>
		<label>note</label> <input ng-model="mileage.note">
	</div>
	<input type="submit" value="Submit">
</form>

////////////////// sample form 

<h4>Settings Page {{tokenid}}</h4>
<div class="header" ng-controller="NavCtrl">
	<ul class="nav nav-pills">
		<li class="active"><a href="#/vehicle">Vehicle</a></li>
		<li><a href="#/route">Route</a></li>
		<li><a href="#/user/profile">Profile</a></li>
		<li><a href="" data-ng-click="logout()">Logout</a></li>
	</ul>
</div>

<form class='form'>
	<h2 class='form-heading'>Add vehicle</h2>
	<input class='form-control' placeholder="Vehicle Name" ng-model="vehicle.name" required>
	<input class="btn btn-large btn-primary" ng-click="saveVehicle()" value="Save"/>
</form>

	<table class="table table-condensed table-bordered table-hover">
		<thead>
			<tr>
				<th>name</th>
				<th>delete</th>
			</tr>
		</thead>
		<tbody>
			<tr ng-class-even="'even'" ng-repeat="vehicle in vehicles">
				<td><a href="#/mileage/{{vehicle._id}}">{{vehicle.name}}</a></td>
				<td><a class='btn btn-primary' ng-click='deleteVehicle(vehicle, $index)' ng-class='{disabled: index < 0}'>Delete</a></td>
			<tr>
		</tbody>
	</table>
	