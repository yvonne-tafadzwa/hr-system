import { useState, useEffect } from "react";
import { Card, Form, Button, Row, Col, Spinner, Alert } from "react-bootstrap";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

const EditProfile = () => {
    const { user, profile, refreshProfile } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        phone: '',
        bio: ''
    });

    useEffect(() => {
        if (profile) {
            setFormData({
                first_name: profile.first_name || '',
                last_name: profile.last_name || '',
                phone: profile.phone || '',
                bio: profile.bio || ''
            });
        }
    }, [profile]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        setSuccess(false);

        try {
            const { error: updateError } = await supabase
                .from('user_profiles')
                .update({
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    phone: formData.phone || null,
                    bio: formData.bio || null,
                    updated_at: new Date().toISOString()
                })
                .eq('id', user.id);

            if (updateError) {
                console.error('Error updating profile:', updateError);
                setError(updateError.message || 'Failed to update profile');
                return;
            }

            // Refresh profile in context
            if (refreshProfile) {
                await refreshProfile();
            }

            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            console.error('Error updating profile:', err);
            setError('An unexpected error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!profile) {
        return (
            <Card className="bg-white border-0 rounded-3 mb-4">
                <Card.Body className="p-4 text-center">
                    <Spinner animation="border" size="sm" />
                    <p className="mb-0 mt-2">Loading profile...</p>
                </Card.Body>
            </Card>
        );
    }

    return (
        <Card className="bg-white border-0 rounded-3 mb-4">
            <Card.Body className="p-4">
                <h3 className="mb-3 mb-lg-4">Edit Profile</h3>

                {success && (
                    <Alert variant="success" className="mb-3" style={{ fontSize: '14px' }}>
                        <i className="ri-check-line me-2"></i>
                        Profile updated successfully!
                    </Alert>
                )}

                {error && (
                    <Alert variant="danger" className="mb-3" style={{ fontSize: '14px' }}>
                        {error}
                    </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label style={{ fontSize: '14px' }}>First Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    placeholder="Enter first name"
                                    style={{ fontSize: '14px' }}
                                />
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label style={{ fontSize: '14px' }}>Last Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    placeholder="Enter last name"
                                    style={{ fontSize: '14px' }}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="mb-3">
                        <Form.Label style={{ fontSize: '14px' }}>Email</Form.Label>
                        <Form.Control
                            type="email"
                            value={user?.email || ''}
                            disabled
                            style={{ fontSize: '14px', backgroundColor: '#f8f9fa' }}
                        />
                        <Form.Text className="text-muted" style={{ fontSize: '12px' }}>
                            Email cannot be changed
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label style={{ fontSize: '14px' }}>Phone</Form.Label>
                        <Form.Control
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Enter phone number"
                            style={{ fontSize: '14px' }}
                        />
                    </Form.Group>

                    <Form.Group className="mb-4">
                        <Form.Label style={{ fontSize: '14px' }}>Bio</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            placeholder="Tell us about yourself..."
                            style={{ fontSize: '14px' }}
                        />
                    </Form.Group>

                    <Button
                        type="submit"
                        variant="primary"
                        disabled={isSubmitting}
                        className="px-4"
                        style={{ fontSize: '14px' }}
                    >
                        {isSubmitting ? (
                            <>
                                <Spinner animation="border" size="sm" className="me-2" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <i className="ri-save-line me-1"></i>
                                Save Changes
                            </>
                        )}
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default EditProfile;
