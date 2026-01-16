<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreContentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'type' => 'required|in:movie,series,game',
            'release_year' => 'nullable|integer|min:1900|max:' . (date('Y') + 5),
            'duration' => 'nullable|string',
            'genres' => 'required|array',
            'platforms' => 'required|array',
            'banner_image' => 'nullable|image|max:2048',
            'cover_image' => 'nullable|image|max:2048',
        ];
    }
}
