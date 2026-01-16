# Backend Public Endpoint Guide

## Public Organizational Structure Endpoint

To enable the public Organizational Structure page to display employee data without authentication, you need to create a public endpoint on your Laravel backend.

### Endpoint Details

**Route:** `GET /api/employees/public`

**Authentication:** None required (public route)

**Response Format:**
```json
{
  "employees": [
    {
      "id": 1,
      "first_name": "Rommil",
      "middle_name": "M.",
      "last_name": "Cagas",
      "position_name": "SR LEO",
      "employee_photo": "employee_photos/0xxnMyKeg2cOj2tXslGOnXebLB0gP67MJ4c8n6vE.jpg",
      "status": "active"
    },
    // ... more employees
  ],
  "head_positions": [
    {
      "id": 1,
      "name": "Emmanuel G. Toledo",
      "position": "DolexCDO Chief",
      "profile_image": "images/profile_images/686dbc3eac756_busa.jpg",
      "is_active": 1
    }
  ]
}
```

### Laravel Implementation

#### 1. Add Route (in `routes/api.php`)

```php
// Public route - no authentication required
Route::get('/employees/public', [EmployeeController::class, 'getPublicEmployees']);
```

#### 2. Controller Method (in `app/Http/Controllers/EmployeeController.php`)

```php
/**
 * Get employees for public organizational structure
 * No authentication required
 */
public function getPublicEmployees()
{
    try {
        // Get active employees with specific positions (LEO I, SR LEO, LEO II, LEO III)
        $employees = Employee::where('status', 'active')
            ->whereIn('position_name', ['LEO I', 'SR LEO', 'LEO II', 'LEO III'])
            ->select([
                'id',
                'first_name',
                'middle_name',
                'last_name',
                'position_name',
                'employee_photo',
                'status'
            ])
            ->orderBy('position_name')
            ->orderBy('last_name')
            ->get();

        // Get head positions (DolexCDO Chief)
        $headPositions = HeadPosition::where('position', 'DolexCDO Chief')
            ->where('is_active', 1)
            ->select([
                'id',
                'name',
                'position',
                'profile_image',
                'is_active'
            ])
            ->get();

        return response()->json([
            'employees' => $employees,
            'head_positions' => $headPositions
        ], 200);
    } catch (\Exception $e) {
        return response()->json([
            'error' => 'Failed to fetch organizational structure data',
            'message' => $e->getMessage()
        ], 500);
    }
}
```

#### 3. Alternative: Using Resource/Collection (Optional)

If you want to format the data, you can create a resource:

```php
// app/Http/Resources/PublicEmployeeResource.php
namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class PublicEmployeeResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'first_name' => $this->first_name,
            'middle_name' => $this->middle_name,
            'last_name' => $this->last_name,
            'position_name' => $this->position_name,
            'employee_photo' => $this->employee_photo,
            'status' => $this->status,
        ];
    }
}
```

Then in the controller:
```php
use App\Http\Resources\PublicEmployeeResource;

public function getPublicEmployees()
{
    $employees = Employee::where('status', 'active')
        ->whereIn('position_name', ['LEO I', 'SR LEO', 'LEO II', 'LEO III'])
        ->get();

    $headPositions = HeadPosition::where('position', 'DolexCDO Chief')
        ->where('is_active', 1)
        ->get();

    return response()->json([
        'employees' => PublicEmployeeResource::collection($employees),
        'head_positions' => $headPositions
    ], 200);
}
```

### Security Considerations

1. **Only return necessary data** - Don't include sensitive information like emails, phone numbers, or internal IDs
2. **Filter active employees only** - Only show employees with `status = 'active'`
3. **Limit to specific positions** - Only return employees with positions: LEO I, SR LEO, LEO II, LEO III
4. **No authentication required** - This is intentional for public access

### Testing

After implementing, test the endpoint:

```bash
# Using curl
curl http://localhost:8000/api/employees/public

# Should return JSON with employees and head_positions arrays
```

### Frontend Integration

The frontend is already configured to use this endpoint. Once you create it, the Organizational Structure page will automatically:
- Fetch data from `/api/employees/public` for non-authenticated users
- Display employee names and photos correctly
- Show head of company information

No frontend changes needed - it will work automatically once the backend endpoint is created!
