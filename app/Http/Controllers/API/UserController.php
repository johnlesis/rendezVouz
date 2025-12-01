<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index(Request $request)
    {
        // Only admins can view all users
        $user = $request->user();

        if (!$user->is_admin) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Get all non-admin users
        $users = User::where('is_admin', false)
            ->select('id', 'name', 'email')
            ->orderBy('name')
            ->get();

        return response()->json($users);
    }
}
